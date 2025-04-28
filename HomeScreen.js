// screens/HomeScreen.js
import React
import { useTheme } from '../context/ThemeContext'; from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import PostFeed from '../components/PostFeed';\nimport LeaderboardWidget from '../components/LeaderboardWidget';\nimport TournamentWidget from '../components/TournamentWidget';

const { theme } = useTheme();

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.feedColumn}>
        <PostFeed curated={true} />
      </ScrollView>


      <TouchableOpacity
        style={styles.newPostButton}
        onPress={() => navigation.navigate('NewPostScreen')}
      >
        <Text style={styles.newPostText}>+ New Post</Text>
      </TouchableOpacity>


      <View style={styles.rightSidebar}>
        <Text style={styles.sidebarTitle}>Operation Intel</Text>
        <Text style={styles.sidebarItem}>• AEGIS rollout v3.2 deployed</Text>
        <Text style={styles.sidebarItem}>• Global ranking resets in 48h</Text>
        <Text style={styles.sidebarItem}>• Tournament sign-ups closing soon</Text>\n\n<LeaderboardWidget />\n\n<TournamentWidget />

        <Text style={styles.sidebarTitle}>Black Market Offers</Text>
        <Text style={styles.sidebarItem}>• 20% off Custom NVG Loadouts</Text>
        <Text style={styles.sidebarItem}>• Tactical Terrain Bundle – Limited</Text>
      </View>
    </View>
  );
}

import OperationalIntel from '../components/OperationalIntel';\n\nconst styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: theme.background,
    paddingHorizontal: 12
  },
  feedColumn: {
    paddingVertical: 20,
    paddingRight: 12, flexDirection: 'row',
    width: screenWidth * 0.65
  },
  leftSidebar: {\n    width: screenWidth * 0.2,\n    paddingTop: 20,\n    paddingRight: 12\n  },\n\n  rightSidebar: {
    width: screenWidth * 0.35 - 24,
    paddingTop: 20,
    paddingLeft: 12
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.accent,
    marginBottom: 10
  },
  sidebarItem: {
    fontSize: 14,
    color: theme.subtle,
    marginBottom: 6
  }
});
