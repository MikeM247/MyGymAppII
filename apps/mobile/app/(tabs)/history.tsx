import { FlatList, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useHistory } from "@/features/history/useHistory";
import { colors } from "@/theme/colors";

export default function HistoryScreen() {
  const sessions = useHistory();

  return (
    <Screen>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{new Date(item.startedAt).toLocaleString()}</Text>
            <Text style={styles.meta}>Volume: {item.totalVolumeKg.toFixed(1)} kg</Text>
            {item.sets.slice(0, 3).map((set) => (
              <Text key={set.id} style={styles.setLine}>{set.exercise.name}: {set.weightKg}kg x {set.reps}</Text>
            ))}
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 10 },
  card: { padding: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: 10, marginVertical: 6 },
  date: { color: colors.text, fontWeight: "700" },
  meta: { color: colors.accent, marginTop: 4 },
  setLine: { color: colors.muted, marginTop: 2 }
});
