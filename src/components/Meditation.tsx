import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type MeditationScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Meditation'
>;

interface MeditationProps {
    navigation: MeditationScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const meditationSessions = [
    {
        id: '1',
        title: 'Morning Calm',
        duration: '10 min',
        description: 'Start your day with peace and clarity',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80',
        difficulty: 'Beginner',
        color: '#FF6B6B',
    },
    {
        id: '2',
        title: 'Stress Relief',
        duration: '15 min',
        description: 'Release tension and find inner peace',
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=500&q=80',
        difficulty: 'Intermediate',
        color: '#4ECDC4',
    },
    {
        id: '3',
        title: 'Deep Relaxation',
        duration: '20 min',
        description: 'Profound relaxation for mind and body',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=500&q=80',
        difficulty: 'Advanced',
        color: '#95E1D3',
    },
    {
        id: '4',
        title: 'Sleep Meditation',
        duration: '25 min',
        description: 'Drift into peaceful sleep',
        image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=500&q=80',
        difficulty: 'All Levels',
        color: '#9B59B6',
    },
    {
        id: '5',
        title: 'Mindfulness',
        duration: '12 min',
        description: 'Be present in the moment',
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=500&q=80',
        difficulty: 'Beginner',
        color: '#F39C12',
    },
    {
        id: '6',
        title: 'Body Scan',
        duration: '18 min',
        description: 'Connect with your physical self',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
        difficulty: 'Intermediate',
        color: '#3498DB',
    },
];

const Meditation: React.FC<MeditationProps> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    const SessionCard = ({ session }: { session: typeof meditationSessions[0] }) => (
        <TouchableOpacity style={styles.sessionCard} activeOpacity={0.8}>
            <Image source={{ uri: session.image }} style={styles.sessionImage} />
            <View style={styles.sessionOverlay}>
                <View style={styles.sessionContent}>
                    <View style={[styles.difficultyBadge, { backgroundColor: session.color }]}>
                        <Text style={styles.difficultyText}>{session.difficulty}</Text>
                    </View>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionDescription}>{session.description}</Text>
                    <View style={styles.sessionFooter}>
                        <View style={styles.durationContainer}>
                            <Ionicons name="time-outline" size={16} color="#fff" />
                            <Text style={styles.durationText}>{session.duration}</Text>
                        </View>
                        <TouchableOpacity style={styles.playButton}>
                            <MaterialIcons name="play-arrow" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Meditation</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Find Your Inner Peace</Text>
                    <Text style={styles.heroSubtitle}>
                        Guided meditation sessions for every mood
                    </Text>
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Sessions */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sessionsContainer}
                >
                    {meditationSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0E17',
    },
    container: {
        flex: 1,
        backgroundColor: '#0A0E17',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    heroSection: {
        backgroundColor: '#1A1F2E',
        padding: 24,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#8A8D9F',
        textAlign: 'center',
    },
    categoriesContainer: {
        backgroundColor: '#1A1F2E',
        paddingBottom: 16,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#2A2F3E',
    },
    categoryButtonActive: {
        backgroundColor: '#6C63FF',
    },
    categoryText: {
        color: '#8A8D9F',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    sessionsContainer: {
        padding: 20,
    },
    sessionCard: {
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sessionImage: {
        width: '100%',
        height: '100%',
    },
    sessionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sessionContent: {
        padding: 20,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    sessionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    sessionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
    },
    sessionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    durationText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSpacer: {
        height: 20,
    },
});

export default Meditation;
