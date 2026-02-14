import { Text, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Screen>
      <Text style={styles.title}>Welcome {user?.name ?? "Lifter"}</Text>
      <Text style={styles.text}>Create templates, log hard sets quickly, and sync when connected.</Text>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>MVP Goals</Text>
        <Text style={styles.text}>- Fast set logging</Text>
        <Text style={styles.text}>- Auto PR detection</Text>
        <Text style={styles.text}>- Offline queue + sync</Text>
      </View>
      <PrimaryButton label="Logout" onPress={() => void logout()} danger />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  text: { color: colors.muted, marginTop: 8 },
  panel: { marginTop: 20, backgroundColor: colors.panel, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14 },
  panelTitle: { color: colors.text, fontWeight: "700", marginBottom: 8 }
});
