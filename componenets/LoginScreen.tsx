import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '../types';
import {
  Alert,
  Animated,
  Easing,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions
} from "react-native";
import axios from 'axios';
import { LoginScreenProps } from '../types';

const { width, height } = Dimensions.get('window');

// Available test users from dummyjson.com
const TEST_USERS = [
  { username: 'emilys', password: 'emilyspass', name: 'Emily Johnson' },
  { username: 'kminchelle', password: '0lelplR', name: 'Jeanne' },
  { username: 'atuny0', password: '9uQFF1Lh', name: 'Terry' },
  { username: 'hbingley1', password: 'CQutx25i8r', name: 'Sheila' },
];

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;

  // Animation sequences
  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotation, {
          toValue: 0.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: -0.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert('Error', 'Please enter both username and password');
    return;
  }

  setIsLoading(true);
  try {
    // Find the test user
    const user = TEST_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Create a properly typed user object
      const userData: UserData = {
        id: user.username === 'emilys' ? 1 : 
            user.username === 'kminchelle' ? 2 : 3, // Simple ID generation
        username: user.username,
        email: `${user.username}@example.com`,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        gender: 'other', // Default or get from your test data
        token: `dummy_token_${Date.now()}`,
        image: undefined // Make image optional as per the type definition
      };
      
      onLogin(userData);
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Error', 'Failed to login. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  // const handleLogin = async () => {
  //   if (!username || !password) {
  //     Alert.alert('Error', 'Please enter both username and password');
  //     return;
  //   }

  //   setIsLoading(true);
  //   Keyboard.dismiss();

  //   try {
  //     // Button press animation
  //     Animated.sequence([
  //       Animated.timing(buttonScale, {
  //         toValue: 0.95,
  //         duration: 100,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(buttonScale, {
  //         toValue: 1,
  //         duration: 100,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();

  //     console.log('Attempting login with:', { username });

  //     // Using axios for API call
  //     const response = await axios.post('https://dummyjson.com/auth/login', {
  //       username: username.trim(),
  //       password: password.trim(),
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       timeout: 10000, // 10 second timeout
  //     });

  //     console.log('Login response status:', response.status);
  //     console.log('Login response data:', response.data);

  //     if (response.status === 200 && response.data) {
  //       const data = response.data;

  //       // DummyJSON auth returns 'token', not 'accessToken'.
  //       if (data.token) {
  //         console.log('Login successful, token received');

  //         // Format user data for the app
  //         const formattedUserData = {
  //           id: data.id,
  //           username: data.username,
  //           email: data.email,
  //           firstName: data.firstName,
  //           lastName: data.lastName,
  //           gender: data.gender,
  //           image: data.image,
  //           token: data.token,
  //         };

  //         console.log('Formatted user data:', formattedUserData);

  //         // Call onLogin with the complete user data
  //         onLogin(formattedUserData);

  //         // Success animation
  //         Animated.parallel([
  //           Animated.spring(buttonScale, {
  //             toValue: 1.5,
  //             friction: 3,
  //             useNativeDriver: true,
  //           }),
  //           Animated.timing(fadeAnim, {
  //             toValue: 0,
  //             duration: 500,
  //             useNativeDriver: true,
  //           }),
  //         ]).start();
  //       } else {
  //         throw new Error('No token received from server');
  //       }
  //     } else {
  //       throw new Error('Invalid response from server');
  //     }
  //   } catch (error: any) {
  //     console.error('Login error details:', {
  //       error: error.response?.data || error.message,
  //       status: error.response?.status,
  //     });

  //     let errorMessage = 'An error occurred during login. Please try again.';

  //     if (error.response) {
  //       // Server responded with error status
  //       if (error.response.status === 400) {
  //         errorMessage = 'Invalid username or password. Please check your credentials.';
  //       } else if (error.response.status === 500) {
  //         errorMessage = 'Server error. Please try again later.';
  //       } else if (error.response.data?.message) {
  //         errorMessage = error.response.data.message;
  //       }
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       errorMessage = 'Network error. Please check your internet connection.';
  //     }

  //     Alert.alert('Login Failed', errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Auto-fill test user credentials
  const fillTestCredentials = (userIndex: number) => {
    const testUser = TEST_USERS[userIndex];
    if (testUser) {
      setUsername(testUser.username);
      setPassword(testUser.password);
    }
  };

  const handleDebugLogin = () => {
    onLogin({
      id: 1,
      username: 'debug_user',
      email: 'debug@example.com',
      firstName: 'Debug',
      lastName: 'User',
      gender: 'male',
      image: 'https://i.pravatar.cc/150?img=12',
      token: 'debug_token',
    });
  };

  const rotateLogo = logoRotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }}
      style={styles.backgroundImage}
      blurRadius={3}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: rotateLogo },
                ],
              },
            ]}
          >
            <Text style={styles.logo}>🧘‍♂️</Text>
            <Text style={styles.title}>Stress Buster</Text>
            <Text style={styles.subtitle}>Find your inner peace</Text>
          </Animated.View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              onSubmitEditing={handleLogin}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Test Users Buttons */}
          <View style={styles.testUsersContainer}>
            <Text style={styles.testUsersTitle}>Quick Test:</Text>
            <View style={styles.testUsersRow}>
              {TEST_USERS.slice(0, 2).map((user, index) => (
                <TouchableOpacity
                  key={user.username}
                  style={styles.testUserButton}
                  onPress={() => fillTestCredentials(index)}
                >
                  <Text style={styles.testUserText}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.testUsersRow}>
              {TEST_USERS.slice(2, 4).map((user, index) => (
                <TouchableOpacity
                  key={user.username}
                  style={styles.testUserButton}
                  onPress={() => fillTestCredentials(index + 2)}
                >
                  <Text style={styles.testUserText}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.footerText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={handleDebugLogin}>
              <Text style={[styles.footerText, { color: '#FF9800' }]}>
                [Debug: Force Login]
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testUsersContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  testUsersTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  testUsersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  testUserButton: {
    flex: 1,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  testUserText: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  forgotButton: {
    marginBottom: 15,
  },
  signupButton: {
    marginTop: 5,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  signUpText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
