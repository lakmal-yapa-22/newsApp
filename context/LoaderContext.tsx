import React, { createContext, useContext, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

type LoaderCtx = { show: ()=>void; hide: ()=>void; };
const Ctx = createContext<LoaderCtx>({ show:()=>{}, hide:()=>{} });

export const LoaderProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Ctx.Provider value={{ show:()=>setLoading(true), hide:()=>setLoading(false) }}>
      {children}
      {loading && (
        <View className="absolute inset-0 justify-center items-center bg-black/20">
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      )}
    </Ctx.Provider>
  );
};

export const useLoader = () => useContext(Ctx);
