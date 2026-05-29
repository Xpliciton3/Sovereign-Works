package com.sovereignworks.alarms

import android.app.AlarmManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SovereignAlarmModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SovereignAlarmModule"

  @ReactMethod
  fun rescheduleAlarms(json: String, promise: Promise) {
    try {
      val ctx = reactApplicationContext.applicationContext
      AlarmScheduler.saveAlarms(ctx, json)
      AlarmScheduler.rescheduleAll(ctx)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("ALARM_SCHEDULE_ERROR", e)
    }
  }

  @ReactMethod
  fun requestExactAlarmPermission(promise: Promise) {
    try {
      val activity = reactApplicationContext.currentActivity
      if (activity == null) {
        promise.resolve(false)
        return
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val am = activity.getSystemService(AlarmManager::class.java)
        if (!am.canScheduleExactAlarms()) {
          val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
            data = Uri.parse("package:${activity.packageName}")
          }
          activity.startActivity(intent)
        }
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("ALARM_PERMISSION_ERROR", e)
    }
  }

  @ReactMethod
  fun canScheduleExactAlarms(promise: Promise) {
    try {
      val ctx = reactApplicationContext.applicationContext
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val am = ctx.getSystemService(AlarmManager::class.java)
        promise.resolve(am.canScheduleExactAlarms())
      } else {
        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject("ALARM_CHECK_ERROR", e)
    }
  }

  @ReactMethod
  fun canDrawOverlays(promise: Promise) {
    try {
      val ctx = reactApplicationContext.applicationContext
      promise.resolve(Settings.canDrawOverlays(ctx))
    } catch (e: Exception) {
      promise.reject("OVERLAY_CHECK_ERROR", e)
    }
  }

  @ReactMethod
  fun getPendingAlarmLog(promise: Promise) {
    try {
      val ctx = reactApplicationContext.applicationContext
      promise.resolve(AlarmScheduler.getPendingLog(ctx))
    } catch (e: Exception) {
      promise.reject("ALARM_LOG_READ", e)
    }
  }

  @ReactMethod
  fun clearPendingAlarmLog(promise: Promise) {
    try {
      val ctx = reactApplicationContext.applicationContext
      AlarmScheduler.clearPendingLog(ctx)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("ALARM_LOG_CLEAR", e)
    }
  }

  @ReactMethod
  fun requestOverlayPermission(promise: Promise) {
    try {
      val activity = reactApplicationContext.currentActivity ?: run {
        promise.resolve(false)
        return
      }
      if (!Settings.canDrawOverlays(activity)) {
        val intent = Intent(
          Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
          Uri.parse("package:${activity.packageName}"),
        )
        activity.startActivity(intent)
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("OVERLAY_PERMISSION_ERROR", e)
    }
  }
}
