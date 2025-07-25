import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";

export default function Input(props: TextInputProps) {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  
  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        props.style,
      ]}
      placeholderTextColor={theme.text}
    />
  );
}
