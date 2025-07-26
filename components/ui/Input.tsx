import React from "react";
import { TextInput, TextInputProps, View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
}

export default function Input({ label, required, ...props }: InputProps) {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  
  return (
    <View style={localStyles.container}>
      {label && (
        <Text style={[localStyles.label, { color: theme.text }]}>
          {label} {required && <Text style={{ color: '#ef4444' }}>*</Text>}
        </Text>
      )}
      <TextInput
        {...props}
        style={[
          styles.input,
          localStyles.input,
          props.style,
        ]}
        placeholderTextColor={theme.secondary}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#ffffff',
  },
});
