package com.sovereignworks.alarms

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONArray
import java.util.Calendar

object AlarmScheduler {
  private const val PREFS = "sovereign_alarms_native"
  private const val KEY_JSON = "alarms_json"
  private const val KEY_LOG = "alarm_log_pending"

  fun saveAlarms(context: Context, json: String) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_JSON, json).apply()
  }

  fun appendLog(context: Context, alarmId: String, dismissedType: String) {
    val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val arr = JSONArray(prefs.getString(KEY_LOG, "[]") ?: "[]")
    val entry = org.json.JSONObject()
    entry.put("alarm_id", alarmId)
    entry.put("dismissed_type", dismissedType)
    entry.put("dismissed_at", System.currentTimeMillis())
    arr.put(entry)
    if (arr.length() > 200) {
      val trimmed = JSONArray()
      for (i in arr.length() - 200 until arr.length()) trimmed.put(arr.get(i))
      prefs.edit().putString(KEY_LOG, trimmed.toString()).apply()
    } else {
      prefs.edit().putString(KEY_LOG, arr.toString()).apply()
    }
  }

  fun rescheduleAll(context: Context) {
    val json = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_JSON, "[]") ?: "[]"
    cancelAll(context)
    val arr = JSONArray(json)
    for (i in 0 until arr.length()) {
      val obj = arr.getJSONObject(i)
      if (!obj.optBoolean("enabled", true)) continue
      val id = obj.optString("id", "alarm-$i")
      val hour = obj.optInt("hour", 6)
      val minute = obj.optInt("minute", 0)
      val label = obj.optString("label", "Alarm")
      val snooze = obj.optInt("snoozeMinutes", 9)
      val days = parseDays(obj.optJSONArray("days"))
      scheduleNext(context, id, hour, minute, label, snooze, days, false)
    }
  }

  fun rescheduleAfterDismiss(context: Context, id: String, hour: Int, minute: Int, label: String, snooze: Int) {
    val days = findDaysForId(context, id)
    scheduleNext(context, id, hour, minute, label, snooze, days, true)
  }

  private fun findDaysForId(context: Context, id: String): IntArray {
    val json = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_JSON, "[]") ?: "[]"
    val arr = JSONArray(json)
    for (i in 0 until arr.length()) {
      val obj = arr.getJSONObject(i)
      if (obj.optString("id") == id) return parseDays(obj.optJSONArray("days"))
    }
    return intArrayOf(1, 2, 3, 4, 5, 6, 7)
  }

  private fun parseDays(arr: JSONArray?): IntArray {
    if (arr == null || arr.length() == 0) {
      return intArrayOf(1, 2, 3, 4, 5, 6, 7)
    }
    val out = IntArray(arr.length())
    for (i in 0 until arr.length()) out[i] = arr.getInt(i)
    return out
  }

  private fun scheduleNext(
    context: Context,
    id: String,
    hour: Int,
    minute: Int,
    label: String,
    snoozeMinutes: Int,
    days: IntArray,
    fromDismiss: Boolean,
  ) {
    val trigger = nextTriggerMillis(hour, minute, days)
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      action = AlarmReceiver.ACTION_FIRE
      putExtra(AlarmReceiver.EXTRA_ID, id)
      putExtra(AlarmReceiver.EXTRA_LABEL, label)
      putExtra(AlarmReceiver.EXTRA_SNOOZE, snoozeMinutes)
      putExtra(AlarmReceiver.EXTRA_HOUR, hour)
      putExtra(AlarmReceiver.EXTRA_MINUTE, minute)
      putExtra(AlarmReceiver.EXTRA_FROM_DISMISS, fromDismiss)
    }
    val pi = PendingIntent.getBroadcast(
      context,
      id.hashCode(),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
    val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, trigger, pi)
    } else {
      am.setExact(AlarmManager.RTC_WAKEUP, trigger, pi)
    }
  }

  fun scheduleSnooze(context: Context, id: String, label: String, snoozeMinutes: Int, hour: Int, minute: Int) {
    val trigger = System.currentTimeMillis() + snoozeMinutes * 60_000L
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      action = AlarmReceiver.ACTION_FIRE
      putExtra(AlarmReceiver.EXTRA_ID, id)
      putExtra(AlarmReceiver.EXTRA_LABEL, label)
      putExtra(AlarmReceiver.EXTRA_SNOOZE, snoozeMinutes)
      putExtra(AlarmReceiver.EXTRA_HOUR, hour)
      putExtra(AlarmReceiver.EXTRA_MINUTE, minute)
      putExtra(AlarmReceiver.EXTRA_FROM_DISMISS, true)
    }
    val pi = PendingIntent.getBroadcast(
      context,
      ("snooze-$id").hashCode(),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
    val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, trigger, pi)
    } else {
      am.setExact(AlarmManager.RTC_WAKEUP, trigger, pi)
    }
  }

  private fun cancelAll(context: Context) {
    val json = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_JSON, "[]") ?: "[]"
    val arr = JSONArray(json)
    val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    for (i in 0 until arr.length()) {
      val id = arr.getJSONObject(i).optString("id", "alarm-$i")
      val intent = Intent(context, AlarmReceiver::class.java).apply { action = AlarmReceiver.ACTION_FIRE }
      val pi = PendingIntent.getBroadcast(
        context,
        id.hashCode(),
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
      am.cancel(pi)
    }
  }

  /** days: 1=Sun … 7=Sat (JS convention) */
  private fun nextTriggerMillis(hour: Int, minute: Int, days: IntArray): Long {
    val cal = Calendar.getInstance()
    val now = cal.timeInMillis
    for (offset in 0..14) {
      val probe = Calendar.getInstance().apply {
        add(Calendar.DAY_OF_YEAR, offset)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
        set(Calendar.HOUR_OF_DAY, hour)
        set(Calendar.MINUTE, minute)
      }
      val dow = probe.get(Calendar.DAY_OF_WEEK)
      val allowed = days.contains(dow)
      if (allowed && probe.timeInMillis > now) {
        return probe.timeInMillis
      }
    }
    val fallback = Calendar.getInstance().apply {
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
      set(Calendar.HOUR_OF_DAY, hour)
      set(Calendar.MINUTE, minute)
      add(Calendar.DAY_OF_YEAR, 1)
    }
    return fallback.timeInMillis
  }
}
