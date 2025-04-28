import React, { useContext } from 'react';
import { createDrawerNavigator
} from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';
import AdminDebugConsoleScreen from '../screens/AdminDebugConsoleScreen'; } from '@react-navigation/drawer';
import QRCodeCoinScreen from '../screens/QRCodeCoinScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ArmyBuilderPage from './screens/ArmyBuilderPage';
import TournamentsPage from './screens/TournamentsPage';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Tournaments">
        <Drawer.Screen name="Tournaments" component={TournamentsPage} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="QR" component={QRCodeCoinScreen} />

      {user?.role === 'admin' && (
        <Drawer.Screen name="Debug Console" component={AdminDebugConsoleScreen} />
      )}
    
  </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;