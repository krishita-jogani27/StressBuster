import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Audio } from 'expo-av';

type SleepMusicScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SleepMusic'
>;

interface SleepMusicProps {
    navigation: SleepMusicScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const musicTracks = [
    {
        id: '1',
        title: 'Peaceful Piano',
        artist: 'Relaxing Music',
        duration: '3:00',
        category: 'Piano',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=500&q=80',
        color: '#E91E63',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
        id: '2',
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: '3:00',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=500&q=80',
        color: '#2196F3',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
        id: '3',
        title: 'Meditation Flow',
        artist: 'Sufi Collection',
        duration: '3:00',
        category: 'Sufi',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
        color: '#FF9800',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
        id: '4',
        title: 'Rain Sounds',
        artist: 'Nature Sounds',
        duration: '3:00',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=500&q=80',
        color: '#607D8B',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
    {
        id: '5',
        title: 'Ambient Dreams',
        artist: 'Relaxation Music',
        duration: '3:00',
        category: 'Ambient',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80',
        color: '#6C63FF',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    },
    {
        id: '6',
        title: 'Calm Piano',
        artist: 'Classical Calm',
        duration: '3:00',
        category: 'Piano',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=500&q=80',
        color: '#9C27B0',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    },
    {
        id: '7',
        title: 'Forest Sounds',
        artist: 'Nature Sounds',
        duration: '3:00',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
        color: '#4CAF50',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    },
    {
        id: '8',
        title: 'Spiritual Chants',
        artist: 'Spiritual Music',
        duration: '3:00',
        category: 'Sufi',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80',
        color: '#FF5722',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    },
];

const SleepMusic: React.FC<SleepMusicProps> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [playingTrack, setPlayingTrack] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['All', 'Sufi', 'Nature', 'Ambient', 'Piano'];

    const filteredTracks = selectedCategory === 'All'
        ? musicTracks
        : musicTracks.filter(track => track.category === selectedCategory);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playSound = async (track: typeof musicTracks[0]) => {
        try {
            setIsLoading(true);

            // Stop current sound if playing
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
            }

            // If clicking the same track, just stop
            if (playingTrack === track.id) {
                setPlayingTrack(null);
                setIsLoading(false);
                return;
            }

            // Load and play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.audioUrl },
                { shouldPlay: true, isLooping: true }
            );

            setSound(newSound);
            setPlayingTrack(track.id);
            setIsLoading(false);

            // Set up playback status update
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish && !status.isLooping) {
                    setPlayingTrack(null);
                }
            });
        } catch (error) {
            console.error('Error playing sound:', error);
            setIsLoading(false);
            setPlayingTrack(null);
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setPlayingTrack(null);
        }
    };

    const resumeSound = async (trackId: string) => {
        if (sound && playingTrack === null) {
            await sound.playAsync();
            setPlayingTrack(trackId);
        }
    };

    const handlePlayPause = async (track: typeof musicTracks[0]) => {
        if (playingTrack === track.id) {
            await pauseSound();
        } else if (sound && playingTrack === null) {
            await resumeSound(track.id);
        } else {
            await playSound(track);
        }
    };

    const MusicCard = ({ track }: { track: typeof musicTracks[0] }) => {
        const isPlaying = playingTrack === track.id;
        const isCurrentTrack = sound !== null && playingTrack === track.id;

        return (
            <TouchableOpacity
                style={styles.musicCard}
                activeOpacity={0.8}
                onPress={() => handlePlayPause(track)}
                disabled={isLoading}
            >
                <Image source={{ uri: track.image }} style={styles.musicImage} />
                <View style={styles.musicOverlay}>
                    <View style={[styles.categoryBadge, { backgroundColor: track.color }]}>
                        <Text style={styles.categoryText}>{track.category}</Text>
                    </View>
                    <View style={styles.musicInfo}>
                        <Text style={styles.musicTitle}>{track.title}</Text>
                        <Text style={styles.musicArtist}>{track.artist}</Text>
                        <View style={styles.musicFooter}>
                            <View style={styles.durationContainer}>
                                <Ionicons name="time-outline" size={16} color="#fff" />
                                <Text style={styles.durationText}>{track.duration}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.playButton, isPlaying && styles.playButtonActive]}
                                onPress={() => handlePlayPause(track)}
                                disabled={isLoading}
                            >
                                {isLoading && playingTrack === track.id ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <MaterialIcons
                                        name={isPlaying ? 'pause' : 'play-arrow'}
                                        size={28}
                                        color="#fff"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sleep Music</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <MaterialIcons name="music-note" size={48} color="#9C27B0" />
                    <Text style={styles.heroTitle}>Relax & Unwind</Text>
                    <Text style={styles.heroSubtitle}>
                        Soothing music and sounds for deep relaxation
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
                                    styles.categoryButtonText,
                                    selectedCategory === category && styles.categoryButtonTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Music Tracks */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.tracksContainer}
                >
                    <Text style={styles.sectionTitle}>
                        {selectedCategory === 'All' ? 'All Tracks' : `${selectedCategory} Music`}
                    </Text>
                    {filteredTracks.map((track) => (
                        <MusicCard key={track.id} track={track} />
                    ))}
                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {/* Now Playing Bar */}
                {playingTrack && (
                    <View style={styles.nowPlayingBar}>
                        <View style={styles.nowPlayingInfo}>
                            <MaterialIcons name="music-note" size={24} color="#9C27B0" />
                            <View style={styles.nowPlayingText}>
                                <Text style={styles.nowPlayingTitle}>
                                    {musicTracks.find(t => t.id === playingTrack)?.title}
                                </Text>
                                <Text style={styles.nowPlayingArtist}>Now Playing...</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.nowPlayingButton}
                            onPress={() => pauseSound()}
                        >
                            <MaterialIcons name="pause" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
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
        backgroundColor: '#9C27B0',
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
        marginTop: 12,
        marginBottom: 8,
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
        backgroundColor: '#9C27B0',
    },
    categoryButtonText: {
        color: '#8A8D9F',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryButtonTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    tracksContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    musicCard: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    musicImage: {
        width: '100%',
        height: '100%',
    },
    musicOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    musicInfo: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    musicTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    musicArtist: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 12,
    },
    musicFooter: {
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
    playButtonActive: {
        backgroundColor: '#9C27B0',
    },
    nowPlayingBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1F2E',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#2A2F3E',
    },
    nowPlayingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    nowPlayingText: {
        marginLeft: 12,
        flex: 1,
    },
    nowPlayingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    nowPlayingArtist: {
        fontSize: 12,
        color: '#8A8D9F',
    },
    nowPlayingButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#9C27B0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSpacer: {
        height: 20,
    },
});

export default SleepMusic;
