import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Order From Desk',
    description: 'Now you can order food right from your desk.',
    image: require('./assets/onboardScreen1.png'),
  },
  {
    key: '2',
    title: 'Pay Online',
    description: 'Never worry about change, pay the exact amount while placing the order.',
    image: require('./assets/onboardScreen2.png'),
  },
  {
    key: '3',
    title: 'Skip Queues',
    description: 'Avoid standing in queues, we will notify you when your order is ready.',
    image: require('./assets/onboardScreen3.png'),
  },
];

const OnboardingSlider = ({ onSkip, onGetStarted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        ref={flatListRef}
      />
      {renderDots()}
      {currentIndex === slides.length - 1 && (
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 225,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 8,
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  skipButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default OnboardingSlider;
