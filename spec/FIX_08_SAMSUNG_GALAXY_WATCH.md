# FIX 08 — SAMSUNG GALAXY WATCH (TENDING APP)
# The Tending app needs a Samsung Galaxy Watch companion.
# This is separate from the Garmin Vivoactive 4 (Imperium only).
# Galaxy Watch 4 and later run Wear OS 3+ (Jetpack Compose for Wear).
# Do not attempt to detect watch model — target Wear OS 3+ only.

---

## WHAT THIS BUILDS

Wear OS companion app for the Tending (ESFJ) app only.
The Imperium uses Garmin — do not cross-wire.

Scope:
- Wear OS tile: today's planner items (read-only, scrollable)
- Wear OS tile: hydration log (+8oz tap)
- Wear OS tile: mood log (1–5 score via crown or tap)
- Complication: planner items done count (X/8)
- Complication: shift strip (WORK / OFF TODAY)
- Morning sync: phone → watch (planner items, schedule, quote truncated to 80 chars)
- Evening sync: watch → phone (mood score, hydration oz logged on watch)
- Notification delivery from phone to watch wrist

---

## TARGET HARDWARE

Samsung Galaxy Watch 4 / 5 / 6 / 7 — all run Wear OS 3+
Display: 396×396px (Watch 6 Classic) or 432×432px (Watch 6)
Write for 396×396 — it works on all sizes.

---

## TECH STACK

```
// Add to apps/tending/package.json dependencies:
"@react-native-community/blur": "^4.x",
// Wear OS is native Android — NOT React Native
// The watch app is a separate Gradle module: apps/tending-wear/
```

Wear OS app stack:
- Language: Kotlin
- UI: Jetpack Compose for Wear OS
- Sync: Wearable Data Layer API (DataClient + MessageClient)
- Build: Gradle, minSdk 30 (Wear OS 3), targetSdk 34

```
apps/tending-wear/
├── build.gradle
├── src/main/
│   ├── AndroidManifest.xml
│   ├── java/com/sovereign/tending/wear/
│   │   ├── MainActivity.kt         ← Wear OS main activity
│   │   ├── tiles/
│   │   │   ├── PlannerTile.kt      ← Today's checklist tile
│   │   │   ├── HydrationTile.kt    ← Hydration quick-log tile
│   │   │   └── MoodTile.kt         ← Mood log tile
│   │   ├── complications/
│   │   │   ├── PlannerComplication.kt
│   │   │   └── ShiftComplication.kt
│   │   └── sync/
│   │       ├── SyncReceiver.kt     ← DataClient listener
│   │       └── SyncManager.kt      ← Push to/from phone
│   └── res/
│       └── values/colors.xml       ← Tending rose palette
```

---

## SYNC ARCHITECTURE

Same pattern as Garmin — no LTE live push. Sync events:

```
MORNING SYNC (app foregrounded + watch paired):
Phone → Watch via DataClient.putDataItem():
  /planner/today         ← 8 items, label + done status
  /schedule/today        ← shift type, start, end
  /quote/today           ← truncated to 80 chars
  /hydration/goal        ← daily oz target

EVENING SYNC (watch → phone when paired):
Watch → Phone via MessageClient.sendMessage():
  /mood/log              ← {score: 1-5, timestamp}
  /hydration/watch       ← {oz: n, timestamp}
  /planner/checked       ← items checked on watch
```

Phone side — add to useHousehold hook:
```typescript
// apps/tending/src/hooks/useWearSync.ts
import { NativeModules } from 'react-native';
const { WearSyncModule } = NativeModules;

export function useMorningSyncToWatch() {
  return async (plannerItems, schedule, quote, hydrationGoal) => {
    await WearSyncModule.syncToWatch({
      planner: plannerItems,
      schedule,
      quote: quote.slice(0, 80),
      hydrationGoal,
    });
  };
}
```

---

## WEAR OS TILE — PLANNER

```kotlin
// PlannerTile.kt
class PlannerTile : TileService() {
    override fun onTileRequest(requestParams: RequestBuilders.TileRequest) =
        Futures.immediateFuture(
            Tile.Builder()
                .setResourcesVersion("1")
                .setTimeline(
                    Timeline.Builder()
                        .addTimelineEntry(buildPlannerEntry())
                        .build()
                )
                .build()
        )

    private fun buildPlannerEntry(): TimelineEntry {
        val items = loadTodayItems() // from local DataStore
        return TimelineEntry.Builder()
            .setLayout(
                Layout.Builder()
                    .setRoot(buildPlannerLayout(items))
                    .build()
            )
            .build()
    }
}
```

Visual: Dark rose background (#120a0e). Each item: checkbox circle + label. Done items shown with strikethrough. Scroll with crown to see all 8. Tap to open phone app.

---

## MOOD TILE

Five-dot display. Crown scrolls score 1–5. Crown press confirms and sends to phone. Shows partner's last score (from DataStore sync) in secondary row with tradition color.

---

## COMPLICATIONS

Short text complication: "5/8 DONE" (planner items)
Range value complication: hydration bar (oz / goal)
Short text complication: "DAY SHIFT" or "OFF TODAY"

---

## WEAR OS MANIFEST ADDITIONS

```xml
<!-- apps/tending-wear/src/main/AndroidManifest.xml -->
<uses-feature android:name="android.hardware.type.watch" />
<uses-permission android:name="com.google.android.wearable.permission.WAKE_APP" />

<application android:allowBackup="true">
  <service android:name=".tiles.PlannerTile"
    android:permission="com.google.android.wearable.permission.BIND_TILE_PROVIDER">
    <intent-filter>
      <action android:name="androidx.wear.tiles.action.BIND_TILE_PROVIDER" />
    </intent-filter>
  </service>
  <service android:name=".tiles.HydrationTile" ... />
  <service android:name=".tiles.MoodTile" ... />
  <receiver android:name=".sync.SyncReceiver">
    <intent-filter>
      <action android:name="com.google.android.gms.wearable.DATA_CHANGED" />
    </intent-filter>
  </receiver>
</application>
```

---

## BUILD SEQUENCE

```
W.01  Create apps/tending-wear/ Gradle module
W.02  Add wearable dependency to apps/tending/ (phone side)
W.03  Implement WearSyncModule.kt (React Native native module bridge)
W.04  Implement SyncManager.kt (DataClient + MessageClient)
W.05  Build PlannerTile.kt
W.06  Build HydrationTile.kt
W.07  Build MoodTile.kt
W.08  Build PlannerComplication.kt
W.09  Build ShiftComplication.kt
W.10  Wire morning sync to app foreground event
W.11  Wire evening sync from watch on DATA_CHANGED receiver
W.12  Test: planner items appear on watch after morning sync
W.13  Test: mood logged on watch appears in phone app
W.14  Build wear APK: ./gradlew :apps:tending-wear:assembleDebug
W.15  Sideload to paired Galaxy Watch for verification
```

---

## VERIFICATION

Wear app is complete when:
1. Planner tile shows today's 8 items with correct done state after morning sync
2. Mood tile accepts 1–5 input and syncs to phone within 30 seconds of pairing
3. Hydration tile increments +8oz and syncs to phone
4. Planner complication shows X/8 done count on watch face
5. Shift complication shows correct work/off status
6. All tiles use Tending rose palette (#120a0e background, #f5c8d8 accent)
