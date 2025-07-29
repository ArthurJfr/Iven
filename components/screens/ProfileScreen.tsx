import { View, Text } from "react-native";
import { themedStyles } from "../../styles/global";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.titleXl}>Profile</Text> 
    </View>
  );
}