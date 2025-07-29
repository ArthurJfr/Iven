import React from "react";
import { Text } from "react-native";
import { globalStyles } from "../../styles/global";

export default function ErrorText({ children }: { children: React.ReactNode }) {

  return (
    <Text style={globalStyles.error}>
      {children}
    </Text>
  );
}
