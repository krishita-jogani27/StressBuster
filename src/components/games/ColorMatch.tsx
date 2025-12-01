import React, { useState, useEffect } from 'react';
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

type ColorMatchScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ColorMatch'
>;

interface ColorMatchProps {
    navigation: ColorMatchScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const COLORS = [
    { name: 'Red', hex: '#FF6B6B', light: '#FFE5E5' },
    { name: 'Blue', hex: '#4ECDC4', light: '#E0F7F6' },
    { name: 'Green', hex: '#4CAF50', light: '#E8F5E9' },
    { name: 'Yellow', hex: '#FFD166', light: '#FFF9E6' },
    { name: 'Purple', hex: '#9C27B0', light: '#F3E5F5' },
    { name: 'Orange', hex: '#FF9800', light: '#FFF3E0' },
];

const ColorMatch: React.FC<ColorMatchProps> = ({ navigation }) => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [targetColor, setTargetColor] = useState(COLORS[0]);
    const [options, setOptions] = useState<typeof COLORS>([]);
    const [gameOver, setGameOver] = useState(false);
    const [lives, setLives] = useState(3);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
        generateNewRound();
    }, []);

    const generateNewRound = () => {
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetColor(target);

        // Create options with the target and random others
        const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
        const opts = shuffled.slice(0, Math.min(3 + level, 6));
        if (!opts.find(c => c.name === target.name)) {
            opts[0] = target;
        }
        setOptions(opts.sort(() => Math.random() - 0.5));
    };

    const handleColorSelect = (selectedColor: typeof COLORS[0]) => {
        if (selectedColor.name === targetColor.name) {
            // Correct answer
            setScore(score + 10 * level);
            if ((score + 10 * level) % 50 === 0) {
                setLevel(level + 1);
            }

            // Animate success
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();

            generateNewRound();
        } else {
            // Wrong answer
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                setGameOver(true);
            }
        }
    };

    const resetGame = () => {
        setScore(0);
        setLevel(1);
        setLives(3);
        setGameOver(false);
        generateNewRound();
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.statsContainer}>
                        <Text style={styles.score}>Score: {score}</Text>
                        <Text style={styles.level}>Level: {level}</Text>
                        <View style={styles.livesContainer}>
                            {[...Array(3)].map((_, i) => (
                                <MaterialIcons
                                    key={i}
                                    name="favorite"
                                    size={20}
                                    color={i < lives ? '#FF6B6B' : '#ccc'}
                                    style={styles.heart}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Game Area */}
                <View style={styles.gameArea}>
                    <Text style={styles.instruction}>Match this color:</Text>

                    <Animated.View
                        style={[
                            styles.targetColorBox,
                            { backgroundColor: targetColor.hex, transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <Text style={styles.colorName}>{targetColor.name}</Text>
                    </Animated.View>

                    <Text style={styles.selectText}>Select the matching color:</Text>

                    <View style={styles.optionsContainer}>
                        {options.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.colorOption, { backgroundColor: color.light }]}
                                onPress={() => handleColorSelect(color)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[styles.colorCircle, { backgroundColor: color.hex }]}
                                />
                                <Text style={styles.optionName}>{color.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Game Over Overlay */}
                {gameOver && (
                    <View style={styles.gameOverlay}>
                        <View style={styles.gameOverContent}>
                            <MaterialIcons name="emoji-events" size={64} color="#FFD166" />
                            <Text style={styles.gameOverText}>Game Over!</Text>
                            <Text style={styles.finalScore}>Final Score: {score}</Text>
                            <Text style={styles.finalLevel}>Level Reached: {level}</Text>
                            <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backToMenuButton} onPress={handleBackPress}>
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
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    score: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    level: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    livesContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    heart: {
        marginHorizontal: 2,
    },
    gameArea: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instruction: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    targetColorBox: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    colorName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    selectText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    colorOption: {
        width: (width - 60) / 3,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    optionName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    gameOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
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
        color: '#4CAF50',
        marginTop: 16,
        marginBottom: 12,
    },
    finalScore: {
        fontSize: 20,
        color: '#333',
        marginBottom: 8,
    },
    finalLevel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    playAgainButton: {
        backgroundColor: '#4CAF50',
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

export default ColorMatch;
