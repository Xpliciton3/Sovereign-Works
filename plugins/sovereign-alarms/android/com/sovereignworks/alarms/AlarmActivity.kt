package com.sovereignworks.alarms

import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.os.CountDownTimer
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.app.Activity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AlarmActivity : Activity() {
  private var confirming = false
  private var timer: CountDownTimer? = null

  private fun traditionFromId(id: String): String =
    if (id.startsWith("tending")) "tending" else "imperium"

  private fun accentColor(tradition: String): Int =
    if (tradition == "tending") Color.parseColor("#c47878") else Color.parseColor("#c9a84c")

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    window.addFlags(
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
    )
    showAlarmScreen()
  }

  private fun showAlarmScreen() {
    confirming = false
    timer?.cancel()
    val label = intent.getStringExtra(AlarmReceiver.EXTRA_LABEL) ?: "Alarm"
    val id = intent.getStringExtra(AlarmReceiver.EXTRA_ID) ?: "alarm"
    val tradition = traditionFromId(id)
    val gold = accentColor(tradition)
    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#0D0D0D"))
      setPadding(48, 48, 48, 48)
    }
    val sigil = TextView(this).apply {
      text = if (tradition == "tending") "◈" else "⬡"
      textSize = 28f
      setTextColor(gold)
      gravity = Gravity.CENTER
    }
    val time = TextView(this).apply {
      text = SimpleDateFormat("h:mm a", Locale.US).format(Date())
      textSize = 42f
      setTextColor(gold)
      gravity = Gravity.CENTER
      setTypeface(Typeface.create("serif", Typeface.NORMAL))
    }
    val title = TextView(this).apply {
      text = label
      textSize = 22f
      setTypeface(Typeface.create("serif", Typeface.ITALIC))
      setTextColor(Color.parseColor("#f0f0f0"))
      gravity = Gravity.CENTER
    }
    val snoozeMin = intent.getIntExtra(AlarmReceiver.EXTRA_SNOOZE, 9)
    val snooze = Button(this).apply {
      text = "SNOOZE · ${snoozeMin}m"
      setTextColor(gold)
      setBackgroundColor(Color.TRANSPARENT)
      setOnClickListener { onSnooze() }
    }
    val awake = Button(this).apply {
      text = "AWAKE"
      setTextColor(Color.BLACK)
      setBackgroundColor(gold)
      setOnClickListener { showConfirmScreen(label, tradition, snoozeMin) }
    }
    root.addView(sigil)
    root.addView(space(12))
    root.addView(time)
    root.addView(space(24))
    root.addView(title)
    root.addView(space(48))
    root.addView(snooze)
    root.addView(space(12))
    root.addView(awake)
    setContentView(root)
  }

  private fun showConfirmScreen(label: String, tradition: String, snoozeMin: Int) {
    confirming = true
    val gold = accentColor(tradition)
    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#0D0D0D"))
      setPadding(48, 48, 48, 48)
    }
    val question = TextView(this).apply {
      text = "Are you actually awake?"
      textSize = 22f
      setTypeface(Typeface.create("serif", Typeface.NORMAL))
      setTextColor(Color.parseColor("#f0f0f0"))
      gravity = Gravity.CENTER
    }
    val countdown = TextView(this).apply {
      id = View.generateViewId()
      text = "Auto-snooze in 30"
      textSize = 14f
      setTextColor(Color.parseColor("#aaaaaa"))
      gravity = Gravity.CENTER
    }
    val yes = Button(this).apply {
      text = "Yes — I'm up"
      setTextColor(Color.BLACK)
      setBackgroundColor(gold)
      setOnClickListener {
        val id = intent.getStringExtra(AlarmReceiver.EXTRA_ID) ?: "alarm"
        AlarmScheduler.appendLog(this@AlarmActivity, id, "awake")
        val hour = intent.getIntExtra(AlarmReceiver.EXTRA_HOUR, 6)
        val minute = intent.getIntExtra(AlarmReceiver.EXTRA_MINUTE, 0)
        val label = intent.getStringExtra(AlarmReceiver.EXTRA_LABEL) ?: "Alarm"
        val snooze = intent.getIntExtra(AlarmReceiver.EXTRA_SNOOZE, 9)
        AlarmScheduler.rescheduleAfterDismiss(this@AlarmActivity, id, hour, minute, label, snooze)
        finishAndRemoveTask()
      }
    }
    val no = Button(this).apply {
      text = "No — $snoozeMin more minutes"
      setTextColor(gold)
      setBackgroundColor(Color.TRANSPARENT)
      setOnClickListener { onSnooze() }
    }
    root.addView(question)
    root.addView(space(16))
    root.addView(countdown)
    root.addView(space(32))
    root.addView(yes)
    root.addView(space(12))
    root.addView(no)
    setContentView(root)

    timer = object : CountDownTimer(30_000, 1_000) {
      override fun onTick(millisUntilFinished: Long) {
        countdown.text = "Auto-snooze in ${millisUntilFinished / 1000}"
      }
      override fun onFinish() {
        onSnooze()
      }
    }.start()
  }

  private fun onSnooze() {
    val id = intent.getStringExtra(AlarmReceiver.EXTRA_ID) ?: "alarm"
    val label = intent.getStringExtra(AlarmReceiver.EXTRA_LABEL) ?: "Alarm"
    val snooze = intent.getIntExtra(AlarmReceiver.EXTRA_SNOOZE, 9)
    val hour = intent.getIntExtra(AlarmReceiver.EXTRA_HOUR, 6)
    val minute = intent.getIntExtra(AlarmReceiver.EXTRA_MINUTE, 0)
    AlarmScheduler.appendLog(this, id, "snooze")
    AlarmScheduler.scheduleSnooze(this, id, label, snooze, hour, minute)
    finishAndRemoveTask()
  }

  private fun space(dp: Int): View {
    val v = View(this)
    v.layoutParams = LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      (dp * resources.displayMetrics.density).toInt(),
    )
    return v
  }

  override fun onDestroy() {
    timer?.cancel()
    super.onDestroy()
  }
}
