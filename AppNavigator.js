import ProfileScreen from '../screens/MyProfileScreen';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import StoreScreen from '../screens/StoreScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/MyProfileScreen';
import NewPostScreen from '../screens/NewPostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import SavedPostsScreen from '../screens/SavedPostsScreen';
import GameHubScreen from '../screens/GameHubScreen';
import MediaViewerScreen from '../screens/MediaViewerScreen';
import ChangeAvatarScreen from '../screens/ChangeAvatarScreen';
import TopNavBar from '../components/TopNavBar';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { View } from 'react-native';

const Drawer = createDrawerNavigator();

function ScreenWithNav({ component: Component, ...rest }) {
  return (
    <View style={{ flex: 1 }}>
      <TopNavBar onMenuPress={rest.navigation.toggleDrawer} />
      <Component {...rest} />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        children={(props) => <ScreenWithNav {...props} component={HomeScreen} />}
      />
      <Drawer.Screen
        name="Store"
        children={(props) => <ScreenWithNav {...props} component={StoreScreen} />}
      />
      <Drawer.Screen
        name="Cart"
        children={(props) => <ScreenWithNav {...props} component={CartScreen} />}
      />
      <Drawer.Screen
        name="Profile"
        children={(props) => <ScreenWithNav {...props} component={ProfileScreen} />}
      />
    
      <Drawer.Screen
        name="UserProfile"
        children={(props) => <ScreenWithNav {...props} component={ProfileScreen} />}
      />
      <Drawer.Screen name="MediaViewer" children={(props) => <ScreenWithNav {...props} component={MediaViewerScreen} />} />
      <Drawer.Screen name="ChangeAvatar" children={(props) => <ScreenWithNav {...props} component={ChangeAvatarScreen} />} />
      <Drawer.Screen name="PostDetail" children={(props) => <ScreenWithNav {...props} component={PostDetailScreen} />} />
      <Drawer.Screen name="SavedPosts" children={(props) => <ScreenWithNav {...props} component={SavedPostsScreen} />} />
      <Drawer.Screen name="GameHub" children={(props) => <ScreenWithNav {...props} component={GameHubScreen} />} />

</Drawer.Navigator>
  );
}