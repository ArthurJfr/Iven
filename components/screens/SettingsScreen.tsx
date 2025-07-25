import { View, Text } from "react-native";
import { themedStyles } from "../../styles/global";
import { useTheme } from "../../contexts/ThemeContext";
import ToggleTheme from "../ui/ToggleTheme";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.titleXl}>Settings</Text>
      <ToggleTheme />
    </View>
  );
}