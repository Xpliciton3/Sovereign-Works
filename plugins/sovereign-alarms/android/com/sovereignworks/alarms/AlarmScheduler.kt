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

  fun saveAlarms(context: Context, json: String) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_JSON, json).apply()
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
      scheduleNext(context, id, hour, minute, label, snooze)
    }
  }

  private fun scheduleNext(
    context: Context,
    id: String,
    hour: Int,
    minute: Int,
    label: String,
    snoozeMinutes: Int,
  ) {
    val trigger = nextTriggerMillis(hour, minute)
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      action = AlarmReceiver.ACTION_FIRE
      putExtra(AlarmReceiver.EXTRA_ID, id)
      putExtra(AlarmReceiver.EXTRA_LABEL, label)
      putExtra(AlarmReceiver.EXTRA_SNOOZE, snoozeMinutes)
      putExtra(AlarmReceiver.EXTRA_HOUR, hour)
      putExtra(AlarmReceiver.EXTRA_MINUTE, minute)
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

  private fun nextTriggerMillis(hour: Int, minute: Int): Long {
    val cal = Calendar.getInstance().apply {
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
      set(Calendar.HOUR_OF_DAY, hour)
      set(Calendar.MINUTE, minute)
    }
    if (cal.timeInMillis <= System.currentTimeMillis()) {
      cal.add(Calendar.DAY_OF_YEAR, 1)
    }
    return cal.timeInMillis
  }
}
