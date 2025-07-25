import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
export default function AppView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>Sample expo router</Text>
      <Link href="/about" style={styles.link}>
        About
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  link: {
    marginTop: 20,
    padding: 10,
    width: 200,
    textAlign: "center",
    color: "#000",
    borderRadius: 5,
  },
});
