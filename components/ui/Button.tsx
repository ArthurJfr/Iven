import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { themedStyles } from "../../styles/global";

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
}

export default function Button({ children, ...rest }: Props) {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  
  return (
    <TouchableOpacity
      style={styles.button}
      {...rest}
    >
      <Text style={styles.buttonText}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
