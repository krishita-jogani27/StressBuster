import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type WhackAMoleScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'WhackAMole'
>;

interface WhackAMoleProps {
    navigation: WhackAMoleScreenNavigationProp;
}

const { width } = Dimensions.get('window');

interface Mole {
    id: number;
    isUp: boolean;
    position: number;
}

const GRID_SIZE = 9; // 3x3 grid
const GAME_DURATION = 30; // seconds

const WhackAMole: React.FC<WhackAMoleProps> = ({ navigation }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [moles, setMoles] = useState<Mole[]>(
        Array.from({ length: GRID_SIZE }, (_, i) => ({
            id: i,
            isUp: false,
            position: i,
        }))
    );

    const moleTimers = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            // Timer countdown
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setGameOver(true);
                        setGameStarted(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Mole pop-up logic
            const moleInterval = setInterval(() => {
                popRandomMole();
            }, 800);

            return () => {
                clearInterval(timer);
                clearInterval(moleInterval);
                moleTimers.current.forEach(clearTimeout);
            };
        }
    }, [gameStarted, gameOver]);

    const popRandomMole = () => {
        const availablePositions = moles
            .filter((m) => !m.isUp)
            .map((m) => m.position);

        if (availablePositions.length === 0) return;

        const randomPos =
            availablePositions[Math.floor(Math.random() * availablePositions.length)];

        setMoles((prev) =>
            prev.map((m) => (m.position === randomPos ? { ...m, isUp: true } : m))
        );

        // Hide mole after 1-2 seconds
        const hideTimer = setTimeout(() => {
            setMoles((prev) =>
                prev.map((m) => (m.position === randomPos ? { ...m, isUp: false } : m))
            );
        }, 1000 + Math.random() * 1000);

        moleTimers.current.push(hideTimer);
    };

    const whackMole = (position: number) => {
        const mole = moles.find((m) => m.position === position);
        if (mole && mole.isUp) {
            setScore((prev) => prev + 10);
            setMoles((prev) =>
                prev.map((m) => (m.position === position ? { ...m, isUp: false } : m))
            );
        }
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameStarted(true);
        setGameOver(false);
        setMoles(
            Array.from({ length: GRID_SIZE }, (_, i) => ({
                id: i,
                isUp: false,
                position: i,
            }))
        );
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const MoleHole = ({ mole }: { mole: Mole }) => {
        const scaleAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            if (mole.isUp) {
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        }, [mole.isUp]);

        return (
            <TouchableOpacity
                style={styles.hole}
                onPress={() => whackMole(mole.position)}
                activeOpacity={0.7}
            >
                <View style={styles.holeInner}>
                    {mole.isUp && (
                        <Animated.View
                            style={[
                                styles.mole,
                                {
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.moleEmoji}>😰</Text>
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Whack-a-Stress</Text>
                    <View style={styles.statsContainer}>
                        <Text style={styles.stat}>⏱️ {timeLeft}s</Text>
                    </View>
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Score</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>

                {/* Game Grid */}
                <View style={styles.gameArea}>
                    <View style={styles.grid}>
                        {moles.map((mole) => (
                            <MoleHole key={mole.id} mole={mole} />
                        ))}
                    </View>
                </View>

                {/* Start/Instructions */}
                {!gameStarted && !gameOver && (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>How to Play</Text>
                        <Text style={styles.instructionsText}>
                            Tap the stressed faces as they pop up!{'\n'}
                            Release your stress by whacking them!
                        </Text>
                        <TouchableOpacity style={styles.startButton} onPress={startGame}>
                            <Text style={styles.startButtonText}>Start Game</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Game Over */}
                {gameOver && (
                    <View style={styles.gameOverlay}>
                        <View style={styles.gameOverContent}>
                            <MaterialIcons name="emoji-events" size={64} color="#FFD166" />
                            <Text style={styles.gameOverText}>Time's Up!</Text>
                            <Text style={styles.finalScore}>Final Score: {score}</Text>
                            <Text style={styles.stressRelieved}>
                                {score > 100 ? '🎉 Great stress relief!' : '💪 Keep practicing!'}
                            </Text>
                            <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.backToMenuButton}
                                onPress={handleBackPress}
                            >
                                <Text style={styles.backToMenuText}>Back to Menu</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: '#2C3E50',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E74C3C',
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
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    stat: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#34495E',
    },
    scoreLabel: {
        fontSize: 16,
        color: '#BDC3C7',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFD166',
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    grid: {
        width: width - 40,
        aspectRatio: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hole: {
        width: (width - 64) / 3,
        height: (width - 64) / 3,
        backgroundColor: '#1A252F',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#34495E',
    },
    holeInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mole: {
        width: '80%',
        height: '80%',
        backgroundColor: '#E74C3C',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    moleEmoji: {
        fontSize: 40,
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    instructionsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 12,
    },
    instructionsText: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: '#E74C3C',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gameOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverContent: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 20,
        alignItems: 'center',
        width: '85%',
    },
    gameOverText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E74C3C',
        marginTop: 16,
        marginBottom: 12,
    },
    finalScore: {
        fontSize: 24,
        color: '#333',
        marginBottom: 8,
    },
    stressRelieved: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    playAgainButton: {
        backgroundColor: '#E74C3C',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 12,
    },
    playAgainText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    backToMenuButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    backToMenuText: {
        color: '#666',
        fontSize: 16,
    },
});

export default WhackAMole;
