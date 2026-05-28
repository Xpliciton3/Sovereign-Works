const {
  withAndroidManifest,
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

function withSovereignAlarms(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    for (const name of PERMS) {
      AndroidConfig.Manifest.addUsesPermission(manifest, name);
    }

    if (!app.receiver) app.receiver = [];
    const hasReceiver = app.receiver.some((r) => r.$?.['android:name'] === '.AlarmReceiver');
    if (!hasReceiver) {
      app.receiver.push({
        $: {
          'android:name': '.AlarmReceiver',
          'android:exported': 'true',
          'android:enabled': 'true',
        },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
              { $: { 'android:name': 'android.intent.action.LOCKED_BOOT_COMPLETED' } },
            ],
          },
        ],
      });
    }

    if (!app.activity) app.activity = [];
    const hasActivity = app.activity.some((a) => a.$?.['android:name'] === '.AlarmActivity');
    if (!hasActivity) {
      app.activity.push({
        $: {
          'android:name': '.AlarmActivity',
          'android:launchMode': 'singleInstance',
          'android:showWhenLocked': 'true',
          'android:turnScreenOn': 'true',
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
        },
      });
    }

    return cfg;
  });
}

module.exports = withSovereignAlarms;
