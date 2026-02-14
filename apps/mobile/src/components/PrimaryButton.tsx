import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  danger?: boolean;
};

export function PrimaryButton({ label, onPress, danger }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, danger ? styles.danger : styles.primary, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6
  },
  primary: {
    backgroundColor: colors.accent
  },
  danger: {
    backgroundColor: colors.danger
  },
  pressed: {
    opacity: 0.85
  },
  text: {
    color: "#07140f",
    fontWeight: "800",
    fontSize: 16
  }
});
