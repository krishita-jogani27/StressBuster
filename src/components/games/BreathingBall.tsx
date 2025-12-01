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

type BreathingBallScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'BreathingBall'
>;

interface BreathingBallProps {
    navigation: BreathingBallScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const BreathingBall: React.FC<BreathingBallProps> = ({ navigation }) => {
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [cycleCount, setCycleCount] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0.3)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBreathing) {
            interval = setInterval(() => {
                setTotalTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isBreathing]);

    useEffect(() => {
        if (isBreathing) {
            startBreathingCycle();
        } else {
            // Reset to initial state
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isBreathing]);

    const startBreathingCycle = () => {
        // Inhale (4 seconds)
        setBreathPhase('inhale');
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 4000,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (!isBreathing) return;

            // Hold (2 seconds)
            setBreathPhase('hold');
            setTimeout(() => {
                if (!isBreathing) return;

                // Exhale (4 seconds)
                setBreathPhase('exhale');
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0.5,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.3,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 2,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (!isBreathing) return;

                    // Rest (2 seconds)
                    setBreathPhase('rest');
                    setTimeout(() => {
                        if (!isBreathing) return;
                        setCycleCount(prev => prev + 1);
                        rotateAnim.setValue(0);
                        startBreathingCycle();
                    }, 2000);
                });
            }, 2000);
        });
    };

    const toggleBreathing = () => {
        setIsBreathing(!isBreathing);
    };

    const resetSession = () => {
        setIsBreathing(false);
        setCycleCount(0);
        setTotalTime(0);
        setBreathPhase('inhale');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const getPhaseText = () => {
        switch (breathPhase) {
            case 'inhale':
                return 'Breathe In...';
            case 'hold':
                return 'Hold...';
            case 'exhale':
                return 'Breathe Out...';
            case 'rest':
                return 'Rest...';
        }
    };

    const getPhaseColor = () => {
        switch (breathPhase) {
            case 'inhale':
                return '#4ECDC4';
            case 'hold':
                return '#FFD166';
            case 'exhale':
                return '#6C63FF';
            case 'rest':
                return '#4CAF50';
        }
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: ['0deg', '180deg', '360deg'],
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: getPhaseColor() }]}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Breathing Exercise</Text>
                    <TouchableOpacity onPress={resetSession} style={styles.resetButton}>
                        <MaterialIcons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{cycleCount}</Text>
                        <Text style={styles.statLabel}>Cycles</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
                        <Text style={styles.statLabel}>Time</Text>
                    </View>
                </View>

                {/* Breathing Ball */}
                <View style={styles.ballContainer}>
                    <Animated.View
                        style={[
                            styles.ball,
                            {
                                backgroundColor: getPhaseColor(),
                                transform: [{ scale: scaleAnim }, { rotate }],
                                opacity: opacityAnim,
                            },
                        ]}
                    >
                        <View style={styles.ballInner} />
                    </Animated.View>

                    <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
                        {getPhaseText()}
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: getPhaseColor() }]}
                        onPress={toggleBreathing}
                    >
                        <MaterialIcons
                            name={isBreathing ? 'pause' : 'play-arrow'}
                            size={32}
                            color="#fff"
                        />
                        <Text style={styles.controlButtonText}>
                            {isBreathing ? 'Pause' : 'Start'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionTitle}>How it works:</Text>
                    <Text style={styles.instructionText}>
                        • Inhale for 4 seconds as the ball expands{'\n'}
                        • Hold for 2 seconds{'\n'}
                        • Exhale for 4 seconds as the ball contracts{'\n'}
                        • Rest for 2 seconds and repeat
                    </Text>
                </View>
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
    resetButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    ballContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    ball: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    ballInner: {
        width: '70%',
        height: '70%',
        borderRadius: width * 0.25,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    phaseText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 40,
    },
    controls: {
        padding: 20,
        alignItems: 'center',
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    controlButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    instructions: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
});

export default BreathingBall;
