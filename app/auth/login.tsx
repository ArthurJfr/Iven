import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import LoginScreen from "../../components/screens/LoginScreen";


export default function Login() {
const theme = useTheme();
  return (
    <LoginScreen />
  );
}
