import React, { createContext, ReactNode, useContext } from 'react';

export default function createContextHook<T>(
  contextInitializer: () => T,
  defaultValue?: T,
): [Context: React.FC<{ children: ReactNode }>, useHook: () => T] {
  const Context = createContext<T | undefined>(defaultValue);

  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const value = contextInitializer();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error('useHook must be used within Provider');
    }
    return context;
  };

  return [Provider, useHook];
}
