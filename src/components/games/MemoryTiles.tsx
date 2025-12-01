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

type MemoryTilesScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MemoryTiles'
>;

interface MemoryTilesProps {
    navigation: MemoryTilesScreenNavigationProp;
}

const { width } = Dimensions.get('window');

interface Tile {
    id: number;
    icon: string;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const ICONS = [
    { icon: 'spa', color: '#6C63FF' },
    { icon: 'favorite', color: '#FF6B6B' },
    { icon: 'wb-sunny', color: '#FFD166' },
    { icon: 'local-florist', color: '#FF9800' },
    { icon: 'self-improvement', color: '#4ECDC4' },
    { icon: 'nature', color: '#4CAF50' },
    { icon: 'star', color: '#9C27B0' },
    { icon: 'cloud', color: '#2196F3' },
];

const MemoryTiles: React.FC<MemoryTilesProps> = ({ navigation }) => {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        if (matches === ICONS.length && matches > 0) {
            setGameWon(true);
        }
    }, [matches]);

    const initializeGame = () => {
        // Create pairs of tiles
        const gameTiles: Tile[] = [];
        ICONS.forEach((iconData, index) => {
            gameTiles.push({
                id: index * 2,
                icon: iconData.icon,
                color: iconData.color,
                isFlipped: false,
                isMatched: false,
            });
            gameTiles.push({
                id: index * 2 + 1,
                icon: iconData.icon,
                color: iconData.color,
                isFlipped: false,
                isMatched: false,
            });
        });

        // Shuffle tiles
        const shuffled = gameTiles.sort(() => Math.random() - 0.5);
        setTiles(shuffled);
        setFlippedTiles([]);
        setMoves(0);
        setMatches(0);
        setGameWon(false);
    };

    const handleTilePress = (tileId: number) => {
        if (isChecking) return;

        const tile = tiles.find(t => t.id === tileId);
        if (!tile || tile.isFlipped || tile.isMatched) return;

        if (flippedTiles.length === 2) return;

        // Flip the tile
        setTiles(prev =>
            prev.map(t => (t.id === tileId ? { ...t, isFlipped: true } : t))
        );

        const newFlipped = [...flippedTiles, tileId];
        setFlippedTiles(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            setIsChecking(true);

            // Check for match
            const [firstId, secondId] = newFlipped;
            const firstTile = tiles.find(t => t.id === firstId);
            const secondTile = tiles.find(t => t.id === secondId);

            if (firstTile && secondTile && firstTile.icon === secondTile.icon) {
                // Match found
                setTimeout(() => {
                    setTiles(prev =>
                        prev.map(t =>
                            t.id === firstId || t.id === secondId
                                ? { ...t, isMatched: true }
                                : t
                        )
                    );
                    setMatches(matches + 1);
                    setFlippedTiles([]);
                    setIsChecking(false);
                }, 600);
            } else {
                // No match
                setTimeout(() => {
                    setTiles(prev =>
                        prev.map(t =>
                            t.id === firstId || t.id === secondId
                                ? { ...t, isFlipped: false }
                                : t
                        )
                    );
                    setFlippedTiles([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const TileComponent = ({ tile }: { tile: Tile }) => {
        const flipAnim = new Animated.Value(tile.isFlipped || tile.isMatched ? 1 : 0);

        useEffect(() => {
            Animated.timing(flipAnim, {
                toValue: tile.isFlipped || tile.isMatched ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [tile.isFlipped, tile.isMatched]);

        const frontInterpolate = flipAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });

        const backInterpolate = flipAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
        });

        return (
            <TouchableOpacity
                style={styles.tileContainer}
                onPress={() => handleTilePress(tile.id)}
                activeOpacity={0.8}
                disabled={tile.isMatched}
            >
                <View style={styles.tile}>
                    <Animated.View
                        style={[
                            styles.tileFace,
                            styles.tileFront,
                            { transform: [{ rotateY: frontInterpolate }] },
                        ]}
                    >
                        <MaterialIcons name="help-outline" size={32} color="#fff" />
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.tileFace,
                            styles.tileBack,
                            { backgroundColor: tile.color, transform: [{ rotateY: backInterpolate }] },
                        ]}
                    >
                        <MaterialIcons name={tile.icon as any} size={32} color="#fff" />
                    </Animated.View>
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
                    <View style={styles.statsHeader}>
                        <Text style={styles.stat}>Moves: {moves}</Text>
                        <Text style={styles.stat}>Matches: {matches}/{ICONS.length}</Text>
                    </View>
                    <TouchableOpacity onPress={initializeGame} style={styles.resetButton}>
                        <MaterialIcons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Game Board */}
                <View style={styles.gameBoard}>
                    {tiles.map(tile => (
                        <TileComponent key={tile.id} tile={tile} />
                    ))}
                </View>

                {/* Game Won Overlay */}
                {gameWon && (
                    <View style={styles.gameOverlay}>
                        <View style={styles.gameOverContent}>
                            <MaterialIcons name="emoji-events" size={80} color="#FFD166" />
                            <Text style={styles.gameWonText}>Congratulations!</Text>
                            <Text style={styles.gameWonSubtext}>
                                You completed the game in {moves} moves!
                            </Text>
                            <TouchableOpacity style={styles.playAgainButton} onPress={initializeGame}>
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
        backgroundColor: '#f0f4ff',
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
    statsHeader: {
        flexDirection: 'row',
        gap: 20,
    },
    stat: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        padding: 8,
    },
    gameBoard: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'center',
        alignContent: 'center',
    },
    tileContainer: {
        width: (width - 48) / 4,
        height: (width - 48) / 4,
        padding: 4,
    },
    tile: {
        flex: 1,
        position: 'relative',
    },
    tileFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tileFront: {
        backgroundColor: '#9C27B0',
    },
    tileBack: {
        backgroundColor: '#6C63FF',
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
    gameWonText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9C27B0',
        marginTop: 16,
        marginBottom: 8,
    },
    gameWonSubtext: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    playAgainButton: {
        backgroundColor: '#9C27B0',
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

export default MemoryTiles;
