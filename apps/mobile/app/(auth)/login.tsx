import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@my-gym-app/shared";
import { useAuthActions } from "@/features/auth/useAuthActions";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  const { login } = useAuthActions();
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = handleSubmit(async (values) => login(values));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>My Gym App II</Text>
        <Text style={styles.subtitle}>Strength-focused logging. Fast and offline-ready.</Text>
      </View>
      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField label="Email" value={field.value} onChangeText={field.onChange} keyboardType="email-address" />}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => <TextField label="Password" value={field.value} onChangeText={field.onChange} secureTextEntry />}
      />
      <PrimaryButton label="Login" onPress={onSubmit} />
      <Link href="/(auth)/register" style={styles.link}>Create account</Link>
      {formState.errors.root && <Text style={styles.error}>{formState.errors.root.message}</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: colors.text, fontWeight: "800", fontSize: 28 },
  subtitle: { color: colors.muted, marginTop: 4 },
  link: { color: colors.accent, marginTop: 12 },
  error: { color: colors.danger, marginTop: 8 }
});
