import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type GameCardProps = {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  image: string;
};

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, color, onPress, image }) => (
  <TouchableOpacity style={[styles.gameCard, { backgroundColor: color + '20' }]} onPress={onPress}>
    <View style={styles.gameContent}>
      <View style={[styles.iconContainer, { backgroundColor: color + '40' }]}>
        <MaterialIcons name={icon as any} size={32} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.gameTitle, { color }]}>{title}</Text>
        <Text style={styles.gameDescription}>{description}</Text>
      </View>
      <Image source={{ uri: image }} style={styles.gameImage} />
    </View>
  </TouchableOpacity>
);

const MindGames = ({ navigation }: any) => {
  const games = [
    {
      id: '1',
      title: 'Bubble Pop',
      description: 'Pop colorful bubbles to relieve stress',
      icon: 'bubble-chart',
      color: '#6C63FF',
      image: 'https://img.freepik.com/free-vector/colorful-bubble-background_23-2148806277.jpg',
    },
    {
      id: '2',
      title: 'Whack-a-Stress',
      description: 'Tap stressed faces to release tension',
      icon: 'sports-esports',
      color: '#E74C3C',
      image: 'https://img.freepik.com/free-vector/emoji-background_23-2147606718.jpg',
    },
    {
      id: '3',
      title: 'Fruit Slicer',
      description: 'Swipe to slice fruits and relax',
      icon: 'restaurant',
      color: '#FF6347',
      image: 'https://img.freepik.com/free-vector/fruit-background_23-2147604424.jpg',
    },
    {
      id: '4',
      title: 'Breathing Ball',
      description: 'Follow the ball to practice breathing',
      icon: 'brightness-5',
      color: '#2196F3',
      image: 'https://img.freepik.com/free-vector/watercolor-stains-abstract-background_23-2149107181.jpg',
    },
    {
      id: '5',
      title: 'Pattern Master',
      description: 'Test your memory with color patterns',
      icon: 'grid-on',
      color: '#9C27B0',
      image: 'https://img.freepik.com/free-vector/colorful-geometric-pattern_23-2147604424.jpg',
    },
  ];

  const handleGamePress = (gameId: string) => {
    // Navigate to the selected game
    switch (gameId) {
      case '1':
        navigation.navigate('BubblePop');
        break;
      case '2':
        navigation.navigate('WhackAMole');
        break;
      case '3':
        navigation.navigate('FruitSlicer');
        break;
      case '4':
        navigation.navigate('BreathingBall');
        break;
      case '5':
        navigation.navigate('PatternMaster');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mind Games</Text>
      <Text style={styles.subHeader}>Relax and unwind with these stress-relieving games</Text>

      <ScrollView style={styles.gamesContainer}>
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            icon={game.icon}
            color={game.color}
            image={game.image}
            onPress={() => handleGamePress(game.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'sans-serif-medium',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    fontFamily: 'sans-serif',
  },
  gamesContainer: {
    flex: 1,
  },
  gameCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  gameImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginLeft: 12,
  },
});

export default MindGames;
