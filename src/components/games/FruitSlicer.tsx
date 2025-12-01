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

type FruitSlicerScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'FruitSlicer'
>;

interface FruitSlicerProps {
    navigation: FruitSlicerScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

interface Fruit {
    id: number;
    emoji: string;
    x: number;
    y: Animated.Value;
    sliced: boolean;
    isBomb: boolean;
}

const FRUITS = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝'];
const GAME_DURATION = 45;

const FruitSlicer: React.FC<FruitSlicerProps> = ({ navigation }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [fruits, setFruits] = useState<Fruit[]>([]);
    const [lives, setLives] = useState(3);

    const fruitIdCounter = useRef(0);
    const gameTimerRef = useRef<NodeJS.Timeout>();
    const spawnTimerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (gameStarted && !gameOver) {
            gameTimerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setGameOver(true);
                        setGameStarted(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            spawnTimerRef.current = setInterval(() => {
                spawnFruit();
            }, 1200);

            return () => {
                if (gameTimerRef.current) clearInterval(gameTimerRef.current);
                if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            };
        }
    }, [gameStarted, gameOver]);

    const spawnFruit = () => {
        const isBomb = Math.random() < 0.15;
        const yValue = new Animated.Value(height);

        const newFruit: Fruit = {
            id: fruitIdCounter.current++,
            emoji: isBomb ? '💣' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
            x: 20 + Math.random() * (width - 100),
            y: yValue,
            sliced: false,
            isBomb,
        };

        setFruits((prev) => [...prev, newFruit]);

        // Animate fruit falling
        Animated.timing(yValue, {
            toValue: -100,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            // Fruit fell off screen
            setFruits((prev) => {
                const fruit = prev.find((f) => f.id === newFruit.id);
                if (fruit && !fruit.sliced && !fruit.isBomb) {
                    setLives((l) => {
                        const newLives = l - 1;
                        if (newLives <= 0) {
                            setGameOver(true);
                            setGameStarted(false);
                        }
                        return newLives;
                    });
                }
                return prev.filter((f) => f.id !== newFruit.id);
            });
        });
    };

    const handleFruitPress = (fruitId: number) => {
        setFruits((prev) =>
            prev.map((fruit) => {
                if (fruit.id === fruitId && !fruit.sliced) {
                    if (fruit.isBomb) {
                        setLives((l) => {
                            const newLives = l - 1;
                            if (newLives <= 0) {
                                setGameOver(true);
                                setGameStarted(false);
                            }
                            return newLives;
                        });
                    } else {
                        setScore((s) => s + 10);
                    }
                    return { ...fruit, sliced: true };
                }
                return fruit;
            })
        );
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameStarted(true);
        setGameOver(false);
        setFruits([]);
        setLives(3);
        fruitIdCounter.current = 0;
    };

    const handleBackPress = () => {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        navigation.goBack();
    };

    const FruitItem = ({ fruit }: { fruit: Fruit }) => {
        const opacity = useRef(new Animated.Value(1)).current;
        const scale = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            if (fruit.sliced) {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                        toValue: 1.5,
                        friction: 3,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [fruit.sliced]);

        return (
            <Animated.View
                style={[
                    styles.fruit,
                    {
                        left: fruit.x,
                        transform: [{ translateY: fruit.y }, { scale }],
                        opacity,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() => handleFruitPress(fruit.id)}
                    activeOpacity={0.7}
                    disabled={fruit.sliced}
                >
                    <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>
                </TouchableOpacity>
            </Animated.View>
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
                    <Text style={styles.title}>Fruit Slicer</Text>
                    <View style={styles.statsContainer}>
                        <Text style={styles.stat}>⏱️ {timeLeft}s</Text>
                    </View>
                </View>

                <View style={styles.gameInfo}>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Score</Text>
                        <Text style={styles.scoreValue}>{score}</Text>
                    </View>
                    <View style={styles.livesContainer}>
                        {[...Array(3)].map((_, i) => (
                            <MaterialIcons
                                key={i}
                                name="favorite"
                                size={28}
                                color={i < lives ? '#E74C3C' : '#ccc'}
                                style={styles.heart}
                            />
                        ))}
                    </View>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>
                    {fruits.map((fruit) => (
                        <FruitItem key={fruit.id} fruit={fruit} />
                    ))}
                </View>

                {/* Instructions */}
                {!gameStarted && !gameOver && (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>How to Play</Text>
                        <Text style={styles.instructionsText}>
                            🍎 Tap fruits to slice them{'\n'}
                            💣 Avoid bombs!{'\n'}
                            ❤️ Don't let fruits fall
                        </Text>
                        <TouchableOpacity style={styles.startButton} onPress={startGame}>
                            <Text style={styles.startButtonText}>Start Slicing</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Game Over */}
                {gameOver && (
                    <View style={styles.gameOverlay}>
                        <View style={styles.gameOverContent}>
                            <MaterialIcons name="emoji-events" size={64} color="#FFD166" />
                            <Text style={styles.gameOverText}>
                                {lives <= 0 ? 'Game Over!' : "Time's Up!"}
                            </Text>
                            <Text style={styles.finalScore}>Final Score: {score}</Text>
                            <Text style={styles.message}>
                                {score > 150 ? '🎉 Master Slicer!' : score > 80 ? '👍 Great job!' : '💪 Keep practicing!'}
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
        backgroundColor: '#FFF8DC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF6347',
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
    },
    stat: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gameInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFE4B5',
    },
    scoreContainer: {
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 14,
        color: '#666',
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    livesContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    heart: {
        marginHorizontal: 2,
    },
    gameArea: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#FFF8DC',
    },
    fruit: {
        position: 'absolute',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fruitEmoji: {
        fontSize: 60,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    instructionsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6347',
        marginBottom: 12,
    },
    instructionsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 28,
    },
    startButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    gameOverText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347',
        marginTop: 16,
        marginBottom: 12,
    },
    finalScore: {
        fontSize: 24,
        color: '#333',
        marginBottom: 8,
    },
    message: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    playAgainButton: {
        backgroundColor: '#FF6347',
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

export default FruitSlicer;
