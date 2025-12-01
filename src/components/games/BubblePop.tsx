import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../src/navigation/AppNavigator';

type BubblePopScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BubblePop'
>;

interface BubblePopProps {
  navigation: BubblePopScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

interface SimpleBubble {
  id: number;
  size: number;
  left: number;
  top: number;
  color: string;
  active: boolean;
}

const colors = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];

const BubblePop: React.FC<BubblePopProps> = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [bubbles, setBubbles] = useState<SimpleBubble[]>([]);

  const createBubble = () => {
    const size = Math.random() * 60 + 40;
    return {
      id: Date.now() + Math.random(),
      size,
      left: Math.random() * (width - size),
      top: Math.random() * (height - 200),
      color: colors[Math.floor(Math.random() * colors.length)],
      active: true,
    };
  };

  const popBubble = (bubbleId: number) => {
    if (gameOver) return;

    setBubbles(prev => {
      const newBubbles = prev.filter(b => b.id !== bubbleId);
      return newBubbles;
    });
    setScore(prev => prev + 10);
  };

  useEffect(() => {
    if (gameOver) return;

    // Add initial bubbles
    const initialBubbles = Array.from({ length: 8 }, createBubble);
    setBubbles(initialBubbles);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });

      // Add new bubble occasionally
      if (Math.random() > 0.7 && bubbles.length < 15) {
        setBubbles(prev => [...prev, createBubble()]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, bubbles.length]);

  const resetGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.timer}>Time: {timeLeft}s</Text>
        </View>

        <View style={styles.gameArea}>
          {bubbles.map(bubble => (
            <TouchableOpacity
              key={bubble.id}
              style={[
                styles.simpleBubble,
                {
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.left,
                  top: bubble.top,
                  backgroundColor: bubble.color,
                  borderRadius: bubble.size / 2,
                },
              ]}
              onPress={() => popBubble(bubble.id)}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {gameOver && (
          <View style={styles.gameOverlay}>
            <View style={styles.gameOverContent}>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.finalScore}>Score: {score}</Text>
              <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

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
    backgroundColor: '#6C63FF',
    padding: 16,
    paddingTop: 16, // Simplified - removed Platform check
  },
  backButton: {
    padding: 8,
  },
  score: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  simpleBubble: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 20,
    color: '#333',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BubblePop;