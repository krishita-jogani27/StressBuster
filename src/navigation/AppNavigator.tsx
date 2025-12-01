// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Dashboard from '../../componenets/Dashboard';
// import MindGames from '../../src/components/games/MindGames';
// import BubblePop from '../../src/components/games/BubblePop';
// import { UserData } from '../../types/index';

// export type RootStackParamList = {
//   Dashboard: undefined;
//   MindGames: undefined;
//   BubblePop: undefined;
//   // Add other game screens here
// };

// const Stack = createStackNavigator<RootStackParamList>();

// // Define props interface for AppNavigator
// interface AppNavigatorProps {
//   userData: UserData;
//   onLogout: () => void;
// }

// const AppNavigator = ({ userData, onLogout }: AppNavigatorProps) => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Dashboard"
//         screenOptions={{
//           // headerShown: false,
//           // animation: 'slide_from_right',
//         }}
//       >
//         <Stack.Screen
//           name="Dashboard"
//           options={{
//             // headerShown: false,
//           }}
//         >
//           {(props) => (
//             <Dashboard
//               {...props}
//               userData={userData}
//               onLogout={onLogout}
//             />
//           )}
//         </Stack.Screen>

//         <Stack.Screen
//           name="MindGames"
//           component={MindGames}
//           options={{
//             headerShown: true,
//             title: 'Mind Games',
//             headerStyle: {
//               backgroundColor: '#6C63FF',
//             },
//             headerTintColor: '#fff',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}
//         />

//         <Stack.Screen
//           name="BubblePop"
//           component={BubblePop}
//           options={{
//             headerShown: false,
//             // presentation: 'fullScreenModal',
//           }}
//         />
//         {/* Add other game screens here */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../../componenets/Dashboard';
import MindGames from '../../src/components/games/MindGames';
import BubblePop from '../../src/components/games/BubblePop';
import WhackAMole from '../../src/components/games/WhackAMole';
import FruitSlicer from '../../src/components/games/FruitSlicer';
import BreathingBall from '../../src/components/games/BreathingBall';
import PatternMaster from '../../src/components/games/PatternMaster';
import Profile from '../../src/components/Profile';
import Meditation from '../../src/components/Meditation';
import Breathing from '../../src/components/Breathing';
import Yoga from '../../src/components/Yoga';
import SleepMusic from '../../src/components/SleepMusic';
import { UserData } from '../../types';

export type RootStackParamList = {
  Dashboard: undefined;
  MindGames: undefined;
  BubblePop: undefined;
  WhackAMole: undefined;
  FruitSlicer: undefined;
  BreathingBall: undefined;
  PatternMaster: undefined;
  Profile: { userData: UserData };
  Meditation: undefined;
  Breathing: undefined;
  Yoga: undefined;
  SleepMusic: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Define props interface for AppNavigator
interface AppNavigatorProps {
  userData: UserData;
  onLogout: () => void;
}

const AppNavigator = ({ userData, onLogout }: AppNavigatorProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
          gestureEnabled: true,
          animationTypeForReplace: 'push',
        }}
      >
        <Stack.Screen
          name="Dashboard"
          options={{
            headerShown: false,
          }}
        >
          {(props) => (
            <Dashboard
              {...props}
              userData={userData}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="MindGames"
          component={MindGames}
          options={{
            headerShown: true,
            title: 'Mind Games',
            headerStyle: {
              backgroundColor: '#6C63FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="BubblePop"
          component={BubblePop}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="WhackAMole"
          component={WhackAMole}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="FruitSlicer"
          component={FruitSlicer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="BreathingBall"
          component={BreathingBall}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="PatternMaster"
          component={PatternMaster}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Meditation"
          component={Meditation}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Breathing"
          component={Breathing}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Yoga"
          component={Yoga}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SleepMusic"
          component={SleepMusic}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;