import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, StyleSheet, View } from "react-native";
import { logWorkoutSchema, type LogWorkoutInput } from "@my-gym-app/shared";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useWorkoutLogger } from "@/features/workouts/useWorkoutLogger";
import { colors } from "@/theme/colors";

export default function LogScreen() {
  const { status, logWorkout } = useWorkoutLogger();

  const { control, handleSubmit } = useForm<LogWorkoutInput>({
    resolver: zodResolver(logWorkoutSchema),
    defaultValues: {
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      notes: "",
      sets: [{
        exerciseId: "00000000-0000-0000-0000-000000000000",
        setNumber: 1,
        weightKg: 0,
        reps: 5,
        rpe: 8,
        restSeconds: 120,
        completedAt: new Date().toISOString()
      }]
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      sets: values.sets.filter((set) => set.exerciseId !== "00000000-0000-0000-0000-000000000000")
    };

    if (payload.sets.length === 0) {
      return;
    }

    await logWorkout(payload);
  });

  return (
    <Screen>
      <Text style={styles.title}>Fast Log</Text>
      <Text style={styles.help}>Enter one set quickly. Expand to multi-set UI in next iteration.</Text>
      <Controller control={control} name="sets.0.exerciseId" render={({ field }) => <TextField label="Exercise UUID" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="sets.0.weightKg" render={({ field }) => <TextField label="Weight (kg)" value={String(field.value)} onChangeText={(v) => field.onChange(Number(v) || 0)} keyboardType="numeric" />} />
      <Controller control={control} name="sets.0.reps" render={({ field }) => <TextField label="Reps" value={String(field.value)} onChangeText={(v) => field.onChange(Number(v) || 1)} keyboardType="numeric" />} />
      <PrimaryButton label="Save Workout" onPress={onSubmit} />
      {!!status && <View style={styles.statusWrap}><Text style={styles.status}>{status}</Text></View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  help: { color: colors.muted, marginBottom: 10 },
  statusWrap: { marginTop: 12, backgroundColor: colors.panelAlt, borderRadius: 10, padding: 12 },
  status: { color: colors.text }
});
