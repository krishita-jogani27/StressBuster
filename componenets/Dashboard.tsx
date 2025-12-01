import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Image,
  Easing,
  Platform,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { DashboardProps } from "../types";
import Sidebar from "./Sidebar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/AppNavigator";
import { withOpacity, Colors } from "../src/utils/colors";

type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const { width } = Dimensions.get("window");

const stressReliefActivities = [
  {
    id: "1",
    title: "Guided Meditation",
    duration: "10 min",
    icon: "spa",
    color: "#6C63FF",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "2",
    title: "Deep Breathing",
    duration: "5 min",
    icon: "wind",
    color: "#4CAF50",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "3",
    title: "Yoga Flow",
    duration: "15 min",
    icon: "running",
    color: "#FF9800",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "4",
    title: "Mind Games",
    duration: "Play & Relax",
    icon: "brain",
    color: "#00BCD4",
    image: "https://images.unsplash.com/photo-1596003906949-67221c37963c?auto=format&fit=crop&w=500&q=80",
  },
];

const userStats = [
  {
    id: "1",
    label: "Streak",
    value: "7",
    unit: "days",
    icon: "local-fire-department",
    color: "#FF6B6B",
  },
  {
    id: "2",
    label: "Sessions",
    value: "12",
    unit: "total",
    icon: "self-improvement",
    color: "#6C63FF",
  },
  {
    id: "3",
    label: "Mindful",
    value: "85",
    unit: "%",
    icon: "favorite",
    color: "#4CAF50",
  },
];

const Dashboard = ({ userData, onLogout }: DashboardProps) => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(slideUp, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogout = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      onLogout();
    }, 300);
  };

  const handleActivityPress = (activityId: string) => {
    if (activityId === "4") {
      navigation.navigate("MindGames");
      return;
    }
    console.log("Activity pressed:", activityId);
  };

  const ActivityCard = ({ item }: { item: any }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleActivityPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.activityCardContainer}
      >
        <Animated.View style={[styles.activityCard, { transform: [{ scale }] }]}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.activityCardBg}
            imageStyle={styles.activityCardImage}
          >
            <View style={styles.activityGradient}>
              <View style={[styles.activityIconBadge, { backgroundColor: item.color }]}>
                <FontAwesome5 name={item.icon as any} size={18} color="#fff" />
              </View>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <View style={styles.activityDurationContainer}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.activityDuration}>{item.duration}</Text>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const StatCard = ({ stat }: { stat: any }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.statCard, { transform: [{ scale }], backgroundColor: stat.color }]}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name={stat.icon as any} size={28} color="#fff" />
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text style={styles.statUnit}>{stat.unit}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#6C63FF"
                colors={["#6C63FF"]}
              />
            }
          >
            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setSidebarOpen(true)}
              >
                <Feather name="menu" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName} numberOfLines={1}>
                  {userData?.firstName || "User"}
                </Text>
                <Text style={styles.subtitle}>How are you feeling today?</Text>
              </View>

              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => setSidebarOpen(true)}
              >
                <Image
                  source={{
                    uri:
                      userData?.image ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.onlineIndicator} />
              </TouchableOpacity>
            </Animated.View>

            {/* Stats Section */}
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Progress</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsContainer}
              >
                {userStats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </ScrollView>
            </Animated.View>

            {/* Activities Section */}
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Stress Relief Activities</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>Explore</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activitiesGrid}>
                {stressReliefActivities.map((activity) => (
                  <ActivityCard key={activity.id} item={activity} />
                ))}
              </View>
            </Animated.View>

            {/* Quick Tips Section */}
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <View style={styles.tipCard}>
                <View style={styles.tipIconContainer}>
                  <MaterialIcons name="lightbulb" size={32} color="#FFD166" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Daily Tip</Text>
                  <Text style={styles.tipText}>
                    Take 5 deep breaths when you feel stressed. It activates your body's relaxation response.
                  </Text>
                </View>
              </View>
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </ImageBackground>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
        onLogout={handleLogout}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0E17",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 23, 0.88)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
  },
  greeting: {
    fontSize: 14,
    color: "#8A8D9F",
    marginBottom: 4,
    textAlign: "center",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8D9F",
    textAlign: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#6C63FF",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  onlineIndicator: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#0A0E17",
    bottom: -2,
    right: -2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  seeAll: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  statCard: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  statUnit: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  activityCardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  activityCard: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activityCardBg: {
    flex: 1,
  },
  activityCardImage: {
    borderRadius: 20,
  },
  activityGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  activityIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  activityDurationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activityDuration: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 215, 102, 0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 102, 0.2)",
    alignItems: "center",
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 215, 102, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFD166",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Dashboard;