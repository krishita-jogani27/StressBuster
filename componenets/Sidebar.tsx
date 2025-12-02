import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { SidebarProps, MenuItem } from '../types';
import { withOpacity } from '../src/utils/colors';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

const menuItems: MenuItem[] = [
  { id: '1', title: 'Profile', icon: 'person-outline', color: '#6C63FF' },
  { id: '2', title: 'Dashboard', icon: 'speedometer', color: '#4CAF50' },
  { id: '3', title: 'Meditation', icon: 'meditation', color: '#FF9800' },
  { id: '4', title: 'Breathing', icon: 'wind', color: '#2196F3' },
  { id: '5', title: 'Sleep Music', icon: 'music-note', color: '#9C27B0' },
  { id: '6', title: 'Yoga & Exercises', icon: 'fitness-center', color: '#E91E63' },
  { id: '7', title: 'Mind Games', icon: 'psychology', color: '#00BCD4' },
  { id: '8', title: 'Consultants', icon: 'people-outline', color: '#FF5722' },
  { id: '9', title: 'Progress', icon: 'bar-chart-outline', color: '#795548' },
  { id: '10', title: 'Settings', icon: 'settings-outline', color: '#607D8B' },
];

const Sidebar = ({ isOpen, onClose, onLogout, userData, navigation }: SidebarProps) => {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleMenuItemPress = (item: MenuItem) => {
    console.log(`Navigate to ${item.title}`);

    // Close sidebar first
    onClose();

    // Navigate after sidebar closes
    setTimeout(() => {
      if (!navigation) return;

      switch (item.id) {
        case '1': // Profile
          navigation.navigate('Profile', { userData });
          break;
        case '2': // Dashboard
          navigation.navigate('Dashboard');
          break;
        case '3': // Meditation
          navigation.navigate('Meditation');
          break;
        case '4': // Breathing
          navigation.navigate('Breathing');
          break;
        case '5': // Sleep & Music
          navigation.navigate('SleepMusic');
          break;
        case '6': // Yoga & Exercises
          navigation.navigate('Yoga');
          break;
        case '7': // Mind Games
          navigation.navigate('MindGames');
          break;
        default:
          console.log(`No navigation for ${item.title}`);
      }
    }, 300);
  };

  const renderIcon = (icon: string, color: string) => {
    switch (icon) {
      case 'meditation':
        return <FontAwesome5 name="meditation" size={22} color={color} />;
      case 'wind':
        return <Feather name="wind" size={22} color={color} />;
      case 'music-note':
        return <Ionicons name="musical-notes-outline" size={22} color={color} />;
      case 'fitness-center':
        return <MaterialIcons name="fitness-center" size={22} color={color} />;
      case 'psychology':
        return <MaterialIcons name="psychology" size={22} color={color} />;
      case 'people-outline':
        return <Ionicons name="people-outline" size={22} color={color} />;
      case 'bar-chart-outline':
        return <Ionicons name="bar-chart-outline" size={22} color={color} />;
      case 'speedometer':
        return <Ionicons name="speedometer-outline" size={22} color={color} />;
      default:
        return <Ionicons name={icon as any} size={22} color={color} />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <Image
            source={{ uri: userData?.image || 'https://i.pravatar.cc/150?img=32' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userData?.firstName} {userData?.lastName}
            </Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.menuScrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuScrollContent}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
            >
              <View style={[styles.iconContainer, { backgroundColor: withOpacity(item.color, 0.15) }]}>
                {renderIcon(item.icon, item.color)}
              </View>

              <Text style={styles.menuText}>{item.title}</Text>

              <Ionicons name="chevron-forward" size={16} color="#8A8D9F" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              onClose();
              setTimeout(onLogout, 300);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: withOpacity('#FF4757', 0.15) }]}>
              <Ionicons name="log-out-outline" size={22} color="#FF4757" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Stress Buster v1.0</Text>
            <Text style={styles.footerSubText}>Find your inner peace</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height,
    backgroundColor: '#0A0E17',
    zIndex: 1000,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 12,
    color: '#8A8D9F',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuScrollContainer: {
    flex: 1,
  },
  menuScrollContent: {
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  bottomSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#FF4757',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#8A8D9F',
  },
  footerSubText: {
    fontSize: 12,
    color: '#6C63FF',
  },
});

export default Sidebar;
