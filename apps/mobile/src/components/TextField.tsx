import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
};

export function TextField({ label, value, onChangeText, secureTextEntry, keyboardType = "default" }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6
  },
  label: {
    color: colors.muted,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600"
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    color: colors.text,
    paddingHorizontal: 12,
    fontSize: 16
  }
});
