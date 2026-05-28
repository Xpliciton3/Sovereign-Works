package com.sovereignworks.alarms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    if (intent == null) return
    when (intent.action) {
      Intent.ACTION_BOOT_COMPLETED,
      Intent.ACTION_LOCKED_BOOT_COMPLETED -> {
        AlarmScheduler.rescheduleAll(context.applicationContext)
      }
      ACTION_FIRE -> {
        val label = intent.getStringExtra(EXTRA_LABEL) ?: "Alarm"
        val id = intent.getStringExtra(EXTRA_ID) ?: "alarm"
        val snooze = intent.getIntExtra(EXTRA_SNOOZE, 9)
        val hour = intent.getIntExtra(EXTRA_HOUR, 6)
        val minute = intent.getIntExtra(EXTRA_MINUTE, 0)
        val launch = Intent(context, AlarmActivity::class.java).apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
          putExtra(EXTRA_LABEL, label)
          putExtra(EXTRA_ID, id)
          putExtra(EXTRA_SNOOZE, snooze)
          putExtra(EXTRA_HOUR, hour)
          putExtra(EXTRA_MINUTE, minute)
        }
        context.startActivity(launch)
      }
    }
  }

  companion object {
    const val ACTION_FIRE = "com.sovereignworks.alarms.FIRE"
    const val EXTRA_ID = "alarm_id"
    const val EXTRA_LABEL = "alarm_label"
    const val EXTRA_SNOOZE = "snooze_minutes"
    const val EXTRA_HOUR = "alarm_hour"
    const val EXTRA_MINUTE = "alarm_minute"
  }
}
