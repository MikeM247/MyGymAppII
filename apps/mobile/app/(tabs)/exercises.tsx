import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useExercises } from "@/features/exercises/useExercises";
import { colors } from "@/theme/colors";

export default function ExercisesScreen() {
  const [q, setQ] = useState("");
  const items = useExercises(q);

  return (
    <Screen>
      <Text style={styles.title}>Exercise Library</Text>
      <TextField label="Search" value={q} onChangeText={setQ} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.muscleGroup} • {item.equipment}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 10 },
  row: { padding: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: 10, marginVertical: 6 },
  name: { color: colors.text, fontWeight: "700" },
  meta: { color: colors.muted, marginTop: 2 }
});
