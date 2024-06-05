import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Card, Divider } from 'react-native-elements';
import OnboardingSlider from './OnboardingSlider';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Số lượng items trên mỗi trang

  const handleSkipOrGetStarted = async () => {
    try {
      await AsyncStorage.setItem('showOnboarding', 'false');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('showOnboarding');
      setShowOnboarding(true);
    } catch (error) {
      console.error('Lỗi khi reset trạng thái onboarding:', error);
    }
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('showOnboarding');
        if (status === 'false') {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error('Lỗi khi truy vấn trạng thái onboarding:', error);
      }
    };

    const fetchChampions = async () => {
      try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json');
        const championsData = Object.values(response.data.data);
        setChampions(championsData);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    checkOnboardingStatus();
    fetchChampions();
  }, []);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(champions.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, champions.length);
  const visibleChampions = champions.slice(startIndex, endIndex);

  const renderTags = (tags) => {
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.item}>
        <Image 
          source={{ uri: `https://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/${item.id}.png` }} 
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.tagsContainer}>
              {renderTags(item.tags)}
            </View>
          </View>
          <Text style={styles.subtitle}>{item.title}</Text>
        </View>
      </View>
      <Divider style={styles.divider} />
    </Card>
  );

  return (
    <View style={styles.container}>
      {showOnboarding ? (
        <OnboardingSlider onSkip={handleSkipOrGetStarted} onGetStarted={handleSkipOrGetStarted} />
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle}>Danh sách các champions</Text>
          </View>
          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={visibleChampions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
              />
            )} 
          </View>
          <View style={styles.paginationContainer}>
            <Button title="Previous" onPress={goToPreviousPage} disabled={currentPage === 1} />
            <Text>{currentPage}</Text>
            <Button title="Next" onPress={goToNextPage} disabled={endIndex === champions.length} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Reset Onboarding" onPress={resetOnboarding} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  listTitleContainer: {
    marginTop: 60,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10, // Khoảng cách giữa tên và thẻ tags
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: 'black',
  },
  divider: {
    marginTop: 10,
  },
});

export default App;
