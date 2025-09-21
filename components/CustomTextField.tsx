import React from "react";
import { TextInput, View, Text } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function CustomTextField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  return (
    <View className="mb-3">
      {label ? (
        <Text className="mb-1 text-sm text-gray-600">{label}</Text>
      ) : null}
      <TextInput
        className="px-3 py-2 text-base bg-gray-100 rounded-lg border border-gray-200 focus:border-red-500"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
    
  );
}
