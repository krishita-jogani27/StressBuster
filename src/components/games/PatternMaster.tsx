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

type PatternMasterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'PatternMaster'
>;

interface PatternMasterProps {
    navigation: PatternMasterScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const COLORS = [
    { id: 0, name: 'Red', color: '#E74C3C', light: '#EC7063' },
    { id: 1, name: 'Blue', color: '#3498DB', light: '#5DADE2' },
    { id: 2, name: 'Green', color: '#2ECC71', light: '#58D68D' },
    { id: 3, name: 'Yellow', color: '#F39C12', light: '#F8C471' },
];

const PatternMaster: React.FC<PatternMasterProps> = ({ navigation }) => {
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [activeButton, setActiveButton] = useState<number | null>(null);

    const playPattern = async () => {
        setIsPlaying(true);
        setIsUserTurn(false);

        for (let i = 0; i < pattern.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setActiveButton(pattern[i]);
            await new Promise((resolve) => setTimeout(resolve, 600));
            setActiveButton(null);
        }

        setIsPlaying(false);
        setIsUserTurn(true);
    };

    const addToPattern = () => {
        const newColor = Math.floor(Math.random() * 4);
        const newPattern = [...pattern, newColor];
        setPattern(newPattern);
        return newPattern;
    };

    const startGame = () => {
        setPattern([]);
        setUserPattern([]);
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        const initialPattern = [Math.floor(Math.random() * 4)];
        setPattern(initialPattern);
        setTimeout(() => {
            playPatternSequence(initialPattern);
        }, 500);
    };

    const playPatternSequence = async (patternToPlay: number[]) => {
        setIsPlaying(true);
        setIsUserTurn(false);

        for (let i = 0; i < patternToPlay.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setActiveButton(patternToPlay[i]);
            await new Promise((resolve) => setTimeout(resolve, 600));
            setActiveButton(null);
        }

        setIsPlaying(false);
        setIsUserTurn(true);
    };

    const handleColorPress = (colorId: number) => {
        if (!isUserTurn || isPlaying) return;

        const newUserPattern = [...userPattern, colorId];
        setUserPattern(newUserPattern);

        // Flash the button
        setActiveButton(colorId);
        setTimeout(() => setActiveButton(null), 300);

        // Check if correct
        if (pattern[newUserPattern.length - 1] !== colorId) {
            // Wrong!
            setGameOver(true);
            setGameStarted(false);
            return;
        }

        // Check if pattern complete
        if (newUserPattern.length === pattern.length) {
            // Correct! Add new color
            setScore(score + 1);
            setUserPattern([]);
            setTimeout(() => {
                const newPattern = addToPattern();
                setTimeout(() => playPatternSequence(newPattern), 500);
            }, 1000);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const ColorButton = ({ color, id }: { color: typeof COLORS[0]; id: number }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            if (activeButton === id) {
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [activeButton]);

        return (
            <TouchableOpacity
                style={styles.colorButtonContainer}
                onPress={() => handleColorPress(id)}
                activeOpacity={0.8}
                disabled={!isUserTurn || isPlaying}
            >
                <Animated.View
                    style={[
                        styles.colorButton,
                        {
                            backgroundColor: activeButton === id ? color.light : color.color,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Text style={styles.colorName}>{color.name}</Text>
                </Animated.View>
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
                    <Text style={styles.title}>Pattern Master</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Level</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                    <Text style={styles.statusText}>
                        {isPlaying
                            ? '👀 Watch the pattern...'
                            : isUserTurn
                                ? '👆 Your turn!'
                                : ''}
                    </Text>
                </View>

                {/* Game Grid */}
                <View style={styles.gameArea}>
                    <View style={styles.grid}>
                        {COLORS.map((color) => (
                            <ColorButton key={color.id} color={color} id={color.id} />
                        ))}
                    </View>
                </View>

                {/* Instructions */}
                {!gameStarted && !gameOver && (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>How to Play</Text>
                        <Text style={styles.instructionsText}>
                            Watch the pattern light up,{'\n'}
                            then repeat it by tapping the colors{'\n'}
                            in the same order!
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
                            <Text style={styles.gameOverText}>Game Over!</Text>
                            <Text style={styles.finalScore}>Level Reached: {score}</Text>
                            <Text style={styles.message}>
                                {score >= 10
                                    ? '🧠 Amazing memory!'
                                    : score >= 5
                                        ? '👍 Great job!'
                                        : '💪 Keep practicing!'}
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
        backgroundColor: '#9B59B6',
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
    scoreContainer: {
        alignItems: 'center',
        paddingVertical: 24,
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
        color: '#9B59B6',
        marginBottom: 8,
    },
    statusText: {
        fontSize: 18,
        color: '#ECF0F1',
        fontWeight: '600',
        minHeight: 24,
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
        gap: 16,
    },
    colorButtonContainer: {
        width: (width - 72) / 2,
        height: (width - 72) / 2,
    },
    colorButton: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    colorName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
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
        color: '#9B59B6',
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
        backgroundColor: '#9B59B6',
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
        color: '#9B59B6',
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
    },
    playAgainButton: {
        backgroundColor: '#9B59B6',
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

export default PatternMaster;
