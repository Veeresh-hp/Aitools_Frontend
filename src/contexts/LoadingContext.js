import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const LoadingContext = createContext();

// 2. Create the provider component
export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  // The functions to change the state
  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  
  // IMPORTANT: The value must be an object that contains what the hook will return
  const value = { isLoading, showLoader, hideLoader };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

// 3. Create the custom hook that components will use
export function useLoading() {
  // This hook's job is to return the context value
  return useContext(LoadingContext); 
}