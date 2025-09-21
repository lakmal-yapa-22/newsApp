import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Loader(){
  return (
    <View className="absolute inset-0 justify-center items-center bg-black/20">
      <ActivityIndicator size="large" color="#dc2626" />
    </View>
  );
}
