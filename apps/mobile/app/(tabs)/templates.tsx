import { FlatList, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTemplateSchema, type CreateTemplateInput } from "@my-gym-app/shared";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTemplates } from "@/features/templates/useTemplates";
import { colors } from "@/theme/colors";

export default function TemplatesScreen() {
  const { templates, createTemplate } = useTemplates();

  const { control, handleSubmit, reset } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      notes: "",
      exercises: [{ exerciseId: "00000000-0000-0000-0000-000000000000", targetSets: 3, targetReps: 8 }]
    }
  });

  const onCreate = handleSubmit(async (values) => {
    const payload = {
      ...values,
      exercises: values.exercises.filter((exercise) => exercise.exerciseId !== "00000000-0000-0000-0000-000000000000")
    };

    if (payload.exercises.length === 0) {
      return;
    }

    await createTemplate(payload);
    reset();
  });

  return (
    <Screen>
      <Text style={styles.title}>Templates</Text>
      <Controller control={control} name="name" render={({ field }) => <TextField label="Template Name" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="notes" render={({ field }) => <TextField label="Notes" value={field.value ?? ""} onChangeText={field.onChange} />} />
      <PrimaryButton label="Create Template" onPress={onCreate} />
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            {!!item.notes && <Text style={styles.meta}>{item.notes}</Text>}
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
