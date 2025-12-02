import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from  './src/components/LoginScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { UserData } from './types';

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (data: UserData) => {
    // Ensure we're not passing any string values where booleans are expected
    const cleanUserData: UserData = {
      id: Number(data.id),
      username: String(data.username || ''),
      email: String(data.email || ''),
      firstName: String(data.firstName || ''),
      lastName: String(data.lastName || ''),
      gender: String(data.gender || ''),
      token: String(data.token || ''),
      ...(data.image && { image: String(data.image) })
    };
    setUserData(cleanUserData);
  };

  const handleLogout = () => {
    setUserData(null);
  };

  return (
    <SafeAreaProvider>
      {!userData ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <AppNavigator userData={userData} onLogout={handleLogout} />
      )}
    </SafeAreaProvider>
  );
}
