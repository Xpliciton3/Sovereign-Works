const fs = require('fs');
const path = require('path');
const {
  withAndroidManifest,
  withMainApplication,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins');

const PERMS = [
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_EXACT_ALARM',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.USE_FULL_SCREEN_INTENT',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.FOREGROUND_SERVICE',
];

const ALARM_PKG = 'com.sovereignworks.alarms';
const SRC_ROOT = path.join(__dirname, 'sovereign-alarms', 'android', 'com', 'sovereignworks', 'alarms');

function copyAlarmSources(projectRoot) {
  const destRoot = path.join(
    projectRoot,
    'android',
    'app',
    'src',
    'main',
    'java',
    'com',
    'sovereignworks',
    'alarms',
  );
  fs.mkdirSync(destRoot, { recursive: true });
  for (const file of fs.readdirSync(SRC_ROOT)) {
    if (!file.endsWith('.kt')) continue;
    fs.copyFileSync(path.join(SRC_ROOT, file), path.join(destRoot, file));
  }
}

function withSovereignAlarms(config) {
  config = withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    for (const name of PERMS) {
      AndroidConfig.Manifest.addUsesPermission(manifest, name);
    }

    if (!app.receiver) app.receiver = [];
    const receiverName = `${ALARM_PKG}.AlarmReceiver`;
    if (!app.receiver.some((r) => r.$?.['android:name'] === receiverName)) {
      app.receiver.push({
        $: {
          'android:name': receiverName,
          'android:exported': 'true',
          'android:enabled': 'true',
        },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
              { $: { 'android:name': 'android.intent.action.LOCKED_BOOT_COMPLETED' } },
              { $: { 'android:name': `${ALARM_PKG}.FIRE` } },
            ],
          },
        ],
      });
    }

    if (!app.activity) app.activity = [];
    const activityName = `${ALARM_PKG}.AlarmActivity`;
    if (!app.activity.some((a) => a.$?.['android:name'] === activityName)) {
      app.activity.push({
        $: {
          'android:name': activityName,
          'android:launchMode': 'singleInstance',
          'android:showWhenLocked': 'true',
          'android:turnScreenOn': 'true',
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
          'android:theme': '@android:style/Theme.Black.NoTitleBar.Fullscreen',
        },
      });
    }

    return cfg;
  });

  config = withMainApplication(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (!contents.includes('import com.sovereignworks.alarms.SovereignAlarmPackage')) {
      contents = contents.replace(
        'import com.facebook.react.ReactApplication',
        'import com.facebook.react.ReactApplication\nimport com.sovereignworks.alarms.SovereignAlarmPackage',
      );
    }
    if (!contents.includes('SovereignAlarmPackage()')) {
      contents = contents.replace(
        'PackageList(this).packages.apply {',
        'PackageList(this).packages.apply {\n          add(SovereignAlarmPackage())',
      );
    }
    cfg.modResults.contents = contents;
    return cfg;
  });

  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      copyAlarmSources(cfg.modRequest.projectRoot);
      return cfg;
    },
  ]);

  return config;
}

module.exports = withSovereignAlarms;
