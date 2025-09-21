import React from 'react';
import { Tabs } from 'expo-router/tabs';
import Entypo from '@expo/vector-icons/Entypo';

const tabs = [
  { label: 'Home', name: 'home', icon: 'home' },
  { label: 'News', name: 'news', icon: 'plus' },
 
] as const;

export default function DashboardLayout(){
  return (
    <Tabs screenOptions={{ headerShown:false }}>
      {tabs.map(t => (
        <Tabs.Screen key={t.name} name={t.name} options={{
          title: t.label,
          tabBarIcon: ({ color, size }) => (<Entypo name={t.icon as any} size={size} color={color} />)
        }} />
      ))}
    </Tabs>
  );
}
