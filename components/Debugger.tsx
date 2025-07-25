import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

interface DebuggerProps {
  isDebugMode?: boolean;
}

export default function Debugger({ isDebugMode = __DEV__ }: DebuggerProps) {
  const { theme } = useTheme();

  if (!isDebugMode) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Link href="/test" asChild>
        <TouchableOpacity style={[styles.button, { borderColor: theme.text }]}>
          <Feather name="settings" size={20} color={theme.text} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});