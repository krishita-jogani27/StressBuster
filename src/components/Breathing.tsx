import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type BreathingScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Breathing'
>;

interface BreathingProps {
    navigation: BreathingScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const Breathing: React.FC<BreathingProps> = ({ navigation }) => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [count, setCount] = useState(0);
    const [cycles, setCycles] = useState(0);

    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        if (isActive) {
            startBreathingCycle();
        } else {
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
    }, [isActive]);

    const startBreathingCycle = () => {
        // Inhale (4 seconds)
        setPhase('inhale');
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
        ]).start(() => {
            if (!isActive) return;

            // Hold (4 seconds)
            setPhase('hold');
            setTimeout(() => {
                if (!isActive) return;

                // Exhale (4 seconds)
                setPhase('exhale');
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
                ]).start(() => {
                    if (!isActive) return;

                    // Rest (2 seconds)
                    setPhase('rest');
                    setTimeout(() => {
                        if (!isActive) return;
                        setCycles(prev => prev + 1);
                        startBreathingCycle();
                    }, 2000);
                });
            }, 4000);
        });
    };

    const toggleBreathing = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setCycles(0);
        }
    };

    const resetSession = () => {
        setIsActive(false);
        setCycles(0);
        setPhase('inhale');
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale':
                return 'Breathe In';
            case 'hold':
                return 'Hold';
            case 'exhale':
                return 'Breathe Out';
            case 'rest':
                return 'Rest';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
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

    const getPhaseInstruction = () => {
        switch (phase) {
            case 'inhale':
                return 'Slowly breathe in through your nose';
            case 'hold':
                return 'Hold your breath gently';
            case 'exhale':
                return 'Slowly breathe out through your mouth';
            case 'rest':
                return 'Relax and prepare for next cycle';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: getPhaseColor() }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                        <Text style={styles.statValue}>{cycles}</Text>
                        <Text style={styles.statLabel}>Cycles Completed</Text>
                    </View>
                </View>

                {/* Breathing Circle */}
                <View style={styles.circleContainer}>
                    <Animated.View
                        style={[
                            styles.circle,
                            {
                                backgroundColor: getPhaseColor(),
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim,
                            },
                        ]}
                    >
                        <View style={styles.circleInner}>
                            <Text style={styles.phaseText}>{getPhaseText()}</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Text style={[styles.instructionText, { color: getPhaseColor() }]}>
                        {getPhaseInstruction()}
                    </Text>
                </View>

                {/* Control Button */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: getPhaseColor() }]}
                        onPress={toggleBreathing}
                    >
                        <MaterialIcons
                            name={isActive ? 'pause' : 'play-arrow'}
                            size={32}
                            color="#fff"
                        />
                        <Text style={styles.controlButtonText}>
                            {isActive ? 'Pause' : 'Start'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tips */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Tips for Better Breathing</Text>
                    <Text style={styles.tipText}>• Find a comfortable position</Text>
                    <Text style={styles.tipText}>• Close your eyes if it helps</Text>
                    <Text style={styles.tipText}>• Focus on the rhythm</Text>
                    <Text style={styles.tipText}>• Practice daily for best results</Text>
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
        backgroundColor: '#0A0E17',
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
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#1A1F2E',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
    statLabel: {
        fontSize: 14,
        color: '#8A8D9F',
        marginTop: 4,
    },
    circleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    circle: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    circleInner: {
        width: '70%',
        height: '70%',
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    instructionsContainer: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    controlsContainer: {
        paddingHorizontal: 40,
        paddingBottom: 20,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
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
    tipsContainer: {
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 14,
        color: '#8A8D9F',
        marginBottom: 8,
        lineHeight: 20,
    },
});

export default Breathing;
