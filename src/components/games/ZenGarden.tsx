import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PanResponder,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ZenGardenScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ZenGarden'
>;

interface ZenGardenProps {
    navigation: ZenGardenScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

interface Stone {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
}

interface RakeLine {
    id: number;
    points: { x: number; y: number }[];
}

const ZenGarden: React.FC<ZenGardenProps> = ({ navigation }) => {
    const [stones, setStones] = useState<Stone[]>([]);
    const [rakeLines, setRakeLines] = useState<RakeLine[]>([]);
    const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([]);
    const [selectedTool, setSelectedTool] = useState<'stone' | 'rake'>('rake');

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;

            if (selectedTool === 'stone') {
                addStone(locationX, locationY);
            } else {
                setCurrentLine([{ x: locationX, y: locationY }]);
            }
        },
        onPanResponderMove: (evt) => {
            if (selectedTool === 'rake') {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentLine(prev => [...prev, { x: locationX, y: locationY }]);
            }
        },
        onPanResponderRelease: () => {
            if (selectedTool === 'rake' && currentLine.length > 0) {
                setRakeLines(prev => [...prev, { id: Date.now(), points: currentLine }]);
                setCurrentLine([]);
            }
        },
    });

    const addStone = (x: number, y: number) => {
        const stoneColors = ['#8B7355', '#A0826D', '#6B5D52', '#9C8B7A'];
        const newStone: Stone = {
            id: Date.now(),
            x,
            y,
            size: 30 + Math.random() * 30,
            color: stoneColors[Math.floor(Math.random() * stoneColors.length)],
        };
        setStones(prev => [...prev, newStone]);
    };

    const clearGarden = () => {
        setStones([]);
        setRakeLines([]);
        setCurrentLine([]);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const renderRakeLine = (line: RakeLine) => {
        if (line.points.length < 2) return null;

        return (
            <View key={line.id} style={StyleSheet.absoluteFill} pointerEvents="none">
                {line.points.map((point, index) => {
                    if (index === 0) return null;
                    const prevPoint = line.points[index - 1];
                    const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
                    const distance = Math.sqrt(
                        Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
                    );

                    return (
                        <View
                            key={`${line.id}-${index}`}
                            style={[
                                styles.rakeLine,
                                {
                                    left: prevPoint.x,
                                    top: prevPoint.y,
                                    width: distance,
                                    transform: [{ rotate: `${angle}rad` }],
                                },
                            ]}
                        />
                    );
                })}
            </View>
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
                    <Text style={styles.title}>Zen Garden</Text>
                    <TouchableOpacity onPress={clearGarden} style={styles.clearButton}>
                        <MaterialIcons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Tool Selection */}
                <View style={styles.toolBar}>
                    <TouchableOpacity
                        style={[styles.toolButton, selectedTool === 'rake' && styles.toolButtonActive]}
                        onPress={() => setSelectedTool('rake')}
                    >
                        <FontAwesome5 name="grip-lines" size={20} color={selectedTool === 'rake' ? '#fff' : '#666'} />
                        <Text style={[styles.toolText, selectedTool === 'rake' && styles.toolTextActive]}>
                            Rake
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, selectedTool === 'stone' && styles.toolButtonActive]}
                        onPress={() => setSelectedTool('stone')}
                    >
                        <MaterialIcons name="circle" size={20} color={selectedTool === 'stone' ? '#fff' : '#666'} />
                        <Text style={[styles.toolText, selectedTool === 'stone' && styles.toolTextActive]}>
                            Stone
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Garden Canvas */}
                <View style={styles.gardenContainer} {...panResponder.panHandlers}>
                    <View style={styles.garden}>
                        {/* Rake lines */}
                        {rakeLines.map(line => renderRakeLine(line))}
                        {currentLine.length > 0 && renderRakeLine({ id: 0, points: currentLine })}

                        {/* Stones */}
                        {stones.map(stone => (
                            <View
                                key={stone.id}
                                style={[
                                    styles.stone,
                                    {
                                        left: stone.x - stone.size / 2,
                                        top: stone.y - stone.size / 2,
                                        width: stone.size,
                                        height: stone.size,
                                        backgroundColor: stone.color,
                                        borderRadius: stone.size / 2,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        {selectedTool === 'rake'
                            ? '🌾 Drag to create calming patterns in the sand'
                            : '🪨 Tap to place stones in your garden'}
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
        backgroundColor: '#f5f5f5',
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
    clearButton: {
        padding: 8,
    },
    toolBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
        justifyContent: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    toolButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        gap: 8,
    },
    toolButtonActive: {
        backgroundColor: '#FF9800',
    },
    toolText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    toolTextActive: {
        color: '#fff',
    },
    gardenContainer: {
        flex: 1,
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    garden: {
        flex: 1,
        backgroundColor: '#E8DCC4',
        position: 'relative',
    },
    stone: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    rakeLine: {
        position: 'absolute',
        height: 3,
        backgroundColor: '#D4C4A8',
        opacity: 0.6,
    },
    instructions: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default ZenGarden;
