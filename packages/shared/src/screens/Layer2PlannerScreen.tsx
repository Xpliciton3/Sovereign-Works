import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { getProfileConfig } from '../profiles';
import { buildPlannerItems, usePlanner } from '../hooks/usePlanner';
import { useSchedule } from '../hooks/useSchedule';
import { useShiftPlanner } from '../hooks/useShiftPlanner';
import { MealIngredients } from './MealIngredients';
import { AlarmManagementScreen } from './AlarmManagementScreen';
import { useCart } from '../hooks/useCart';
import { RECIPES } from '../data/recipes';
import { holyDayOnDate } from '../data/holyDays';
import { useDietary } from '../hooks/useDietary';
import { useHouseholdContext } from '../context/HouseholdContext';
import { SyncStatusDot } from '../ui/SyncStatusDot';

const PALETTE = {
  imperium: { gold: '#c9a84c', cNour: '#e05828', cMind: '#9060f0', cBody: '#18c48a', cSoul: '#c9a84c', cPlan: '#c9a84c' },
  tending: { gold: '#c47878', cNour: '#c06048', cMind: '#9878b0', cBody: '#c48054', cSoul: '#c47878', cPlan: '#c47878' },
};

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2PlannerScreen({ profile, colors }: Props) {
  const hh = useHouseholdContext();
  const [planTab, setPlanTab] = useState<'today' | 'calendar' | 'alarms' | 'reminders' | 'schedule'>('today');
  const [openId, setOpenId] = useState<string | null>(null);
  const {
    sleepWindow,
    overtimeHours,
    shiftLabel,
    setOvertime,
    cancelOvertime,
    shiftType,
    isWorkDay,
    setShiftType,
    anchorDate,
    setAnchorDate,
    scheduleType,
    setScheduleType,
    shiftStart,
    shiftEnd,
  } = useSchedule();
  const { schedule } = useShiftPlanner(profile, shiftType, isWorkDay, sleepWindow.wake);
  const { done, toggleDone } = usePlanner(profile, hh.householdId);
  const { addIngredient, addAllIngredients } = useCart(profile, hh.householdId);
  const { diet } = useDietary();
  const p = PALETTE[profile];
  const items = buildPlannerItems(profile, p, sleepWindow, shiftType, isWorkDay, schedule);
  const doneCount = items.filter((it) => done[it.id]).length;
  const pc = getProfileConfig(profile);

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <View style={styles.planTabs}>
        {(['today', 'calendar', 'alarms', 'reminders', 'schedule'] as const).map((tab) => (
          <Pressable key={tab} onPress={() => setPlanTab(tab)} style={styles.planTabBtn}>
            <Text style={{ color: planTab === tab ? p.cPlan : colors.textMuted, fontSize: 10, letterSpacing: 1 }}>
              {tab.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.shiftStrip, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <SyncStatusDot status={hh.syncStatus} colors={colors} onRetry={() => void hh.retrySync()} size={7} />
          <Text style={[styles.shiftText, { color: colors.textMuted, flex: 1 }]}>
            {shiftLabel}
            {overtimeHours > 0 ? ` · OT +${overtimeHours}h` : ''}
            {schedule ? ` · Active ${schedule.activeWindowStart}–${schedule.activeWindowEnd}` : ''}
          </Text>
        </View>
      </View>
      {sleepWindow && (
        <View style={[styles.sleepCard, { borderColor: '#4a6a9a', backgroundColor: colors.surface }]}>
          <Text style={{ color: '#5a80b0', fontSize: 11, letterSpacing: 1 }}>SLEEP WINDOW</Text>
          <Text style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>
            Wind down {sleepWindow.windDown} · Sleep {sleepWindow.sleep} · Wake {sleepWindow.wake}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>{sleepWindow.note}</Text>
        </View>
      )}
      <View style={[styles.progress, { backgroundColor: colors.surfaceElevated }]}>
        <View style={[styles.progressFill, { width: `${(doneCount / items.length) * 100}%`, backgroundColor: p.cPlan }]} />
      </View>
      <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
        {doneCount} / {items.length} complete
      </Text>

      {planTab === 'today' &&
        items.map((item) => {
          const isOpen = openId === item.id;
          const isMeal = item.id === 'b' || item.id === 'l' || item.id === 'd';
          return (
            <View key={item.id} style={[styles.itemCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Pressable
                onPress={() => setOpenId(isOpen ? null : item.id)}
                style={styles.itemRow}
              >
                <Pressable
                  onPress={() => toggleDone(item.id)}
                  style={[styles.check, { borderColor: done[item.id] ? item.color : `${item.color}55` }]}
                >
                  {done[item.id] && <Text style={{ color: item.color, fontSize: 12 }}>✓</Text>}
                </Pressable>
                <View style={styles.itemBody}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>{item.label}</Text>
                  {item.sub && <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.sub}</Text>}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: colors.textDisabled, fontSize: 10 }}>{item.time}</Text>
                    {item.isLate && !done[item.id] && (
                      <Text style={{ color: '#e05828', fontSize: 9, letterSpacing: 1 }}>LATE</Text>
                    )}
                  </View>
                </View>
                {item.id === 'bed' ? (
                  <Pressable onPress={() => setPlanTab('alarms')} style={[styles.alarmBtnInline, { borderColor: '#4a6a9a' }]}>
                    <Text style={{ color: '#5a80b0', fontSize: 9, letterSpacing: 0.5 }}>SET ALARM</Text>
                  </Pressable>
                ) : (
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                )}
              </Pressable>
              {isOpen && (
                <View style={[styles.expand, { borderTopColor: colors.border }]}>
                  {isMeal && item.mealName ? (
                    <MealIngredients
                      mealName={item.mealName}
                      colors={colors}
                      accent={p.cNour}
                      diet={diet}
                      onAddIngredient={addIngredient}
                      onAddAll={(name) => {
                        const rec = RECIPES[name];
                        if (rec) addAllIngredients(rec.ing);
                      }}
                    />
                  ) : (
                    <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>
                      {item.expandText ?? ''}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      {planTab === 'calendar' && (
        <View style={[styles.stubCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {(() => {
            const holy = holyDayOnDate(new Date().toISOString().slice(0, 10));
            if (holy) {
              return (
                <>
                  <Text style={{ color: colors.accent, fontSize: 14 }}>{holy.calendarSymbol} {holy.title}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6 }}>{holy.placement_meaning}</Text>
                </>
              );
            }
            return <Text style={{ color: colors.text }}>Calendar grid expands in Layer 6. Holy days appear as events.</Text>;
          })()}
        </View>
      )}
      {planTab === 'alarms' && <AlarmManagementScreen profile={profile} colors={colors} />}
      {planTab === 'reminders' && (
        <View style={[styles.stubCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, marginBottom: 6 }}>Hydration reminders</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            {schedule?.hydrationReminders?.length
              ? schedule.hydrationReminders.join(' · ')
              : 'Synced when Groq planner runs — see Alarms tab.'}
          </Text>
          {schedule?.groqNote && (
            <Text style={{ color: colors.textDisabled, fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>
              {schedule.groqNote}
            </Text>
          )}
        </View>
      )}
      {planTab === 'schedule' && (
        <View style={[styles.stubCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Rotation pattern</Text>
          <View style={styles.otRow}>
            {(['223', '410', '312', '247'] as const).map((pat) => (
              <Pressable key={pat} onPress={() => setScheduleType(pat)} style={[styles.otBtn, { borderColor: colors.border }]}>
                <Text style={{ color: scheduleType === pat ? p.cPlan : colors.textMuted, fontSize: 11 }}>{pat}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ color: colors.text, marginTop: 12, marginBottom: 8 }}>Shift kind</Text>
          <View style={styles.otRow}>
            <Pressable onPress={() => setShiftType('day')} style={[styles.otBtn, { borderColor: colors.border }]}>
              <Text style={{ color: shiftType === 'day' ? p.cPlan : colors.textMuted }}>Day {shiftStart}–{shiftEnd}</Text>
            </Pressable>
            <Pressable onPress={() => setShiftType('night')} style={[styles.otBtn, { borderColor: colors.border }]}>
              <Text style={{ color: shiftType === 'night' ? p.cPlan : colors.textMuted }}>Night {shiftStart}–{shiftEnd}</Text>
            </Pressable>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>Pattern anchor date</Text>
          <View style={styles.otRow}>
            {['2024-01-01', '2024-01-08', '2024-01-15'].map((d) => (
              <Pressable key={d} onPress={() => setAnchorDate(d)} style={[styles.otBtn, { borderColor: colors.border }]}>
                <Text style={{ color: anchorDate === d ? p.cPlan : colors.textMuted, fontSize: 11 }}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.declCard, { borderLeftColor: colors.accent, borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontSize: 16, fontStyle: 'italic' }}>{pc.morningDeclaration}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 48, paddingBottom: 40 },
  shiftStrip: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  planTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  planTabBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  shiftText: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  sleepCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  progress: { height: 4, borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: '100%' },
  progressLabel: { fontSize: 10, marginBottom: 14 },
  itemCard: { borderWidth: 1, borderRadius: 8, marginBottom: 8, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, gap: 10 },
  check: { width: 22, height: 22, borderWidth: 1.5, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  itemBody: { flex: 1, gap: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  expand: { borderTopWidth: StyleSheet.hairlineWidth, padding: 12 },
  alarmBtn: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderRadius: 4 },
  alarmBtnInline: { paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderRadius: 4 },
  declCard: { borderLeftWidth: 3, borderWidth: 1, borderRadius: 8, padding: 16, marginTop: 8 },
  stubCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  otRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  otBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 },
});
