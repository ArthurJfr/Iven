import { useTheme } from "../../contexts/ThemeContext";
import { View, Switch, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ToggleTheme() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Switch
        value={mode === "dark"}
        onValueChange={toggleTheme}
        thumbColor={mode === "dark" ? theme.secondary : "#fff"}
        trackColor={{ false: "#ccc", true: theme.primary }}
        style={styles.switch}
      />
      <Feather
        name="moon"
        size={24}
        color={mode === "dark" ? theme.primary : "#aaa"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
  },
  switch: {
    marginHorizontal: 8,
  },
});
