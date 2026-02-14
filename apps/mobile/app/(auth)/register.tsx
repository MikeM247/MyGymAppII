import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@my-gym-app/shared";
import { useAuthActions } from "@/features/auth/useAuthActions";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/theme/colors";

export default function RegisterScreen() {
  const { register } = useAuthActions();
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" }
  });

  const onSubmit = handleSubmit(async (values) => register(values));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
      </View>
      <Controller control={control} name="name" render={({ field }) => <TextField label="Name" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="email" render={({ field }) => <TextField label="Email" value={field.value} onChangeText={field.onChange} keyboardType="email-address" />} />
      <Controller control={control} name="password" render={({ field }) => <TextField label="Password" value={field.value} onChangeText={field.onChange} secureTextEntry />} />
      <PrimaryButton label="Register" onPress={onSubmit} />
      <Link href="/(auth)/login" style={styles.link}>Already have an account?</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: colors.text, fontWeight: "800", fontSize: 28 },
  link: { color: colors.accent, marginTop: 12 }
});
