import React from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type YogaScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Yoga'
>;

interface YogaProps {
    navigation: YogaScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const yogaPoses = [
    {
        id: '1',
        name: 'Child\'s Pose',
        sanskritName: 'Balasana',
        duration: '2-3 min',
        difficulty: 'Beginner',
        benefits: 'Relieves stress, calms the mind',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
        color: '#FF6B6B',
    },
    {
        id: '2',
        name: 'Cat-Cow Pose',
        sanskritName: 'Marjaryasana',
        duration: '1-2 min',
        difficulty: 'Beginner',
        benefits: 'Releases tension in spine',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80',
        color: '#4ECDC4',
    },
    {
        id: '3',
        name: 'Downward Dog',
        sanskritName: 'Adho Mukha Svanasana',
        duration: '1-3 min',
        difficulty: 'Intermediate',
        benefits: 'Energizes and relieves stress',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80',
        color: '#95E1D3',
    },
    {
        id: '4',
        name: 'Corpse Pose',
        sanskritName: 'Savasana',
        duration: '5-10 min',
        difficulty: 'All Levels',
        benefits: 'Deep relaxation, reduces anxiety',
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=500&q=80',
        color: '#9B59B6',
    },
    {
        id: '5',
        name: 'Legs Up Wall',
        sanskritName: 'Viparita Karani',
        duration: '5-15 min',
        difficulty: 'Beginner',
        benefits: 'Calms nervous system',
        image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=500&q=80',
        color: '#F39C12',
    },
    {
        id: '6',
        name: 'Seated Forward Bend',
        sanskritName: 'Paschimottanasana',
        duration: '3-5 min',
        difficulty: 'Intermediate',
        benefits: 'Relieves stress and anxiety',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80',
        color: '#3498DB',
    },
    {
        id: '7',
        name: 'Bridge Pose',
        sanskritName: 'Setu Bandhasana',
        duration: '1-2 min',
        difficulty: 'Beginner',
        benefits: 'Reduces anxiety, calms mind',
        image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=500&q=80',
        color: '#E74C3C',
    },
    {
        id: '8',
        name: 'Standing Forward Bend',
        sanskritName: 'Uttanasana',
        duration: '1-3 min',
        difficulty: 'Beginner',
        benefits: 'Relieves tension, calms mind',
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=500&q=80',
        color: '#16A085',
    },
];

const Yoga: React.FC<YogaProps> = ({ navigation }) => {
    const PoseCard = ({ pose }: { pose: typeof yogaPoses[0] }) => (
        <TouchableOpacity style={styles.poseCard} activeOpacity={0.8}>
            <Image source={{ uri: pose.image }} style={styles.poseImage} />
            <View style={styles.poseOverlay}>
                <View style={[styles.difficultyBadge, { backgroundColor: pose.color }]}>
                    <Text style={styles.difficultyText}>{pose.difficulty}</Text>
                </View>
                <View style={styles.poseContent}>
                    <Text style={styles.poseName}>{pose.name}</Text>
                    <Text style={styles.sanskritName}>{pose.sanskritName}</Text>
                    <View style={styles.poseInfo}>
                        <View style={styles.infoItem}>
                            <MaterialIcons name="access-time" size={16} color="#fff" />
                            <Text style={styles.infoText}>{pose.duration}</Text>
                        </View>
                    </View>
                    <Text style={styles.benefits}>{pose.benefits}</Text>
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
                    <Text style={styles.title}>Yoga & Exercise</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Stress-Relief Poses</Text>
                    <Text style={styles.heroSubtitle}>
                        Gentle yoga poses to calm your mind and body
                    </Text>
                </View>

                {/* Poses Grid */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.posesContainer}
                >
                    {yogaPoses.map((pose) => (
                        <PoseCard key={pose.id} pose={pose} />
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
        backgroundColor: '#FF9800',
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
    scrollView: {
        flex: 1,
    },
    posesContainer: {
        padding: 20,
    },
    poseCard: {
        height: 240,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    poseImage: {
        width: '100%',
        height: '100%',
    },
    poseOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        justifyContent: 'space-between',
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    poseContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    poseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    sanskritName: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    poseInfo: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        gap: 4,
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
    },
    benefits: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    bottomSpacer: {
        height: 20,
    },
});

export default Yoga;
