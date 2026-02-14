import { useMemo } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { Screen } from "@/components/Screen";
import { useAnalytics } from "@/features/analytics/useAnalytics";
import { colors } from "@/theme/colors";

export default function AnalyticsScreen() {
  const stats = useAnalytics();

  const volumeSeries = useMemo(
    () => (stats?.volumeByExercise ?? []).slice(-12).map((point, i) => ({ x: i + 1, y: point.volumeKg })),
    [stats]
  );

  const prSeries = useMemo(
    () => (stats?.prProgression ?? []).slice(-12).map((point, i) => ({ x: i + 1, y: point.weightKg })),
    [stats]
  );

  const freqSeries = useMemo(
    () => (stats?.weeklyFrequency ?? []).slice(-12).map((point, i) => ({ x: i + 1, y: point.count })),
    [stats]
  );

  return (
    <Screen>
      <ScrollView>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Volume trend (last 12 points)</Text>
        <VictoryChart theme={VictoryTheme.material} domainPadding={12}>
          <VictoryAxis style={axisStyle} />
          <VictoryAxis dependentAxis style={axisStyle} />
          <VictoryLine style={{ data: { stroke: colors.accent, strokeWidth: 3 } }} data={volumeSeries} />
        </VictoryChart>

        <Text style={styles.subtitle}>PR progression</Text>
        <VictoryChart theme={VictoryTheme.material} domainPadding={12}>
          <VictoryAxis style={axisStyle} />
          <VictoryAxis dependentAxis style={axisStyle} />
          <VictoryLine style={{ data: { stroke: "#55b3ff", strokeWidth: 3 } }} data={prSeries} />
        </VictoryChart>

        <Text style={styles.subtitle}>Weekly frequency</Text>
        <VictoryChart theme={VictoryTheme.material} domainPadding={12}>
          <VictoryAxis style={axisStyle} />
          <VictoryAxis dependentAxis style={axisStyle} />
          <VictoryLine style={{ data: { stroke: "#f5b642", strokeWidth: 3 } }} data={freqSeries} />
        </VictoryChart>
      </ScrollView>
    </Screen>
  );
}

const axisStyle = {
  axis: { stroke: colors.border },
  tickLabels: { fill: colors.muted, fontSize: 10 },
  grid: { stroke: "#202834" }
};

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: colors.muted, marginTop: 10 }
});
