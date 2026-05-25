# FIREBASE REALTIME DATABASE — SCHEMA

---

## ROOT STRUCTURE

```
sovereign-works/
└── households/
    └── {householdId}/
        ├── config/
        ├── calendar/
        ├── shifts/
        ├── mood/
        ├── grocery/
        ├── mealPlan/
        └── hydration/
```

---

## CONFIG

```json
"config": {
  "householdId": "string",
  "householdName": "string",           // e.g. "Bane"
  "createdAt": "number",
  "members": {
    "imperium": {
      "profile": "imperium",
      "personName": "Garrin",
      "deviceToken": "string",          // for push notifications
      "joinedAt": "number"
    },
    "tending": {
      "profile": "tending",
      "personName": "Holli",
      "deviceToken": "string",
      "joinedAt": "number"
    }
  }
}
```

---

## CALENDAR

```json
"calendar": {
  "events": {
    "{eventId}": {
      "id": "string",
      "title": "string",
      "date": "string",               // "YYYY-MM-DD"
      "startTime": "string",          // "HH:MM" 24hr
      "endTime": "string",
      "allDay": "boolean",
      "type": "personal|shared|appointment|couple|holyDay|rite",
      "notes": "string",
      "addedBy": "imperium|tending",
      "visibility": "shared|imperium|tending",
      "createdAt": "number",
      "alarmMinutesBefore": "number"  // 0 = at time, -1 = no alarm
    }
  }
}
```

**Visibility rule:**
- `"shared"` → appears in both planners
- `"imperium"` → only Garrin's app (private — actually stored locally, not Firebase)
- `"tending"` → only Holli's app (private — stored locally, not Firebase)

**IMPORTANT:** Private events (`imperium` or `tending` visibility) are stored on-device only using expo-sqlite. They never reach Firebase.

---

## SHIFTS

```json
"shifts": {
  "imperium": {
    "config": {
      "scheduleType": "rotating_223",
      "shiftLength": 12,
      "shiftStartHour": 18,           // 18 = 6PM start (night shift)
      "cycleStartDate": "2025-01-01",
      "patternDays": [2, 2, 3],       // 2 on, 2 off, 3 on = one cycle
      "overrides": {
        "YYYY-MM-DD": {
          "status": "on|off|modified",
          "startHour": "number",
          "note": "string"
        }
      }
    },
    "generated": {
      "YYYY-MM-DD": "on|off"           // pre-generated 90 days forward
    }
  },
  "tending": {
    "config": {
      "scheduleType": "rotating_223|rotating_3112|custom|standard|variable",
      "shiftLength": 12,
      "shiftStartHour": 7,
      "isNightShift": false,
      "cycleStartDate": "string",
      "patternDays": [],
      "overrides": {}
    },
    "generated": {}
  }
}
```

---

## MOOD

```json
"mood": {
  "imperium": {
    "translatedEntries": {
      "YYYY-MM-DD": {
        "translatedText": "string",    // ESFJ-register translation ONLY
        "dotScore": "number",          // 1-5 (NOT raw 1-10 score)
        "approved": "boolean",
        "timestamp": "number"
      }
    }
  },
  "tending": {
    "translatedEntries": {
      "YYYY-MM-DD": {
        "translatedText": "string",    // INTJ-register translation
        "dotScore": "number",
        "approved": "boolean",
        "timestamp": "number"
      }
    }
  }
}
```

**CRITICAL:** Raw mood scores and raw mood text NEVER go to Firebase. Only the approved translation and dot score (1-5, not 1-10) are synced.

---

## OFFLINE-FIRST DATA ARCHITECTURE

**Rule: SQLite is always the source of truth on each device. Firebase is the sync layer.**

Every feature that must work without network (grocery shopping, planner, alarms,
hydration logging) writes to SQLite first. Firebase receives the write when
network is available. If Firebase is unavailable, the device never blocks.

Conflict resolution: last-write-wins on `updatedAt` timestamp. The most recent
change to a shared record wins when two devices sync.

```typescript
// Sync pattern used everywhere shared data is written:
async function writeShared<T>(
  localDb: SQLite.Database,
  firebasePath: string,
  record: T & { updatedAt: number }
): Promise<void> {
  // 1. Write to SQLite immediately — never fails, never waits
  await localDb.runAsync(`INSERT OR REPLACE INTO sync_queue ...`, record);

  // 2. Attempt Firebase write — non-blocking
  try {
    await firebaseSet(firebasePath, record);
    await localDb.runAsync(`DELETE FROM sync_queue WHERE id = ?`, record.id);
  } catch {
    // Queued in sync_queue — will retry on next network available event
  }
}

// On app foreground / network restored:
async function drainSyncQueue(db: SQLite.Database) {
  const pending = await db.getAllAsync(`SELECT * FROM sync_queue ORDER BY updatedAt ASC`);
  for (const item of pending) {
    try {
      await firebaseSet(item.path, item.data);
      await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, item.id);
    } catch { break; } // stop on first failure, retry next time
  }
}
```

**What is SQLite-primary (works fully offline):**
- Grocery list (all items, checked state)
- Meal plan overrides (user swaps)
- Mood raw entries (never leaves device)
- Hydration daily log entries
- Alarm configurations
- Daily planner completion state
- Quote bank

**What is Firebase-primary (requires network to create, syncs to device):**
- Household config and join
- Shift schedule configuration
- Shared calendar events
- Mood translated entries (partner view)
- Hydration daily totals (partner visibility)

---

## GROCERY

```json
"grocery": {
  "currentList": {
    "{itemId}": {
      "id": "string",
      "name": "string",
      "category": "PRODUCE|PROTEINS|DAIRY|PANTRY_OILS|PANTRY_GRAINS|PANTRY_CANNED|PANTRY_BAKING|HERBS_FRESH|HERBS_DRIED|FROZEN|BEVERAGES|WELLNESS|HOUSEHOLD",
      "quantity": "string",
      "unit": "string",
      "checked": "boolean",
      "addedBy": "imperium|tending",
      "recipeSource": "string",
      "addedAt": "number",
      "updatedAt": "number"
    }
  },
  "lastUpdated": "number"
}
```

SQLite schema mirrors this exactly. Every item written to SQLite first,
then queued for Firebase sync. Checked state syncs in real time when both
phones are online (one person checks off an item, the other sees it immediately).
When offline, checked state updates locally and syncs on reconnect.

---

## MEAL PLAN

```json
"mealPlan": {
  "weeklyAssignment": {
    "YYYY-WW": {                       // year-weeknumber
      "monday": {
        "breakfast": "recipeId",
        "lunch": "recipeId",
        "dinner": "recipeId",
        "snack": "recipeId"
      },
      "tuesday": {
        "breakfast": "recipeId",
        "lunch": "recipeId",
        "dinner": "recipeId",
        "snack": "recipeId"
      },
      "wednesday": { "breakfast":"recipeId","lunch":"recipeId","dinner":"recipeId","snack":"recipeId" },
      "thursday":  { "breakfast":"recipeId","lunch":"recipeId","dinner":"recipeId","snack":"recipeId" },
      "friday":    { "breakfast":"recipeId","lunch":"recipeId","dinner":"recipeId","snack":"recipeId" },
      "saturday":  { "breakfast":"recipeId","lunch":"recipeId","dinner":"recipeId","snack":"recipeId" },
      "sunday":    { "breakfast":"recipeId","lunch":"recipeId","dinner":"recipeId","snack":"recipeId" }
    }
  }
}
```

---

## HYDRATION

```json
"hydration": {
  "imperium": {
    "YYYY-MM-DD": {
      "targetOz": 100,
      "loggedOz": 72,
      "entries": [
        { "oz": 8, "timestamp": 1234567890, "type": "water|tea|other" }
      ]
    }
  },
  "tending": {
    "YYYY-MM-DD": {
      "targetOz": 96,
      "loggedOz": 64,
      "entries": []
    }
  }
}
```

---

## SECURITY RULES

```json
{
  "rules": {
    "households": {
      "$householdId": {
        ".read": "auth.uid != null",
        ".write": "auth.uid != null",
        "config": { ".read": true, ".write": "auth.uid != null" },
        "mood": {
          "imperium": {
            "translatedEntries": { ".read": true, ".write": "auth.uid != null" }
          },
          "tending": {
            "translatedEntries": { ".read": true, ".write": "auth.uid != null" }
          }
        }
      }
    }
  }
}
```

Note: Authentication in Phase 1 uses the household code as an anonymous auth token. No email/password required.

