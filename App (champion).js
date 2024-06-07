import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Card, Divider } from 'react-native-elements';
import OnboardingSlider from './OnboardingSlider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChampionDetail from './ChampionDetail';
const flatListRef = React.createRef();




const Stack = createStackNavigator();

const ChampionList = ({ navigation }) => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true); // State mới để theo dõi load dữ liệu lần đầu
  const itemsPerPage = 5; // Số lượng items trên mỗi trang

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

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const fetchChampions = async (page = 1) => {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json');
      const championsData = Object.values(response.data.data);
      const newChampions = championsData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      setChampions(prevChampions => [...prevChampions, ...newChampions]);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setLoading(false);
      setLoadingMore(false);
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

    checkOnboardingStatus();

    // Chỉ gọi fetchChampions nếu dữ liệu chưa được load lần nào (firstLoad = true)
    if (firstLoad) {
      fetchChampions(currentPage);
      setFirstLoad(false); // Gán firstLoad thành false sau khi dữ liệu được load lần đầu
    }
  }, [firstLoad]); // Thêm firstLoad vào dependencies của useEffect

  const loadMoreChampions = () => {
    if (!loadingMore && !firstLoad) { // Kiểm tra firstLoad trước khi load thêm dữ liệu
      setLoadingMore(true);
      setCurrentPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchChampions(nextPage);
        return nextPage;
      });
    }
  };

  const renderTags = (tags) => {
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChampionDetail', { championId: item.id })}>
      <Card containerStyle={styles.card}>
        <View style={styles.item}>
          <Image 
            source={{ uri: `https://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/${item.id}.png` }} 
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameAndTagsContainer}>
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showOnboarding ? (
        <OnboardingSlider onSkip={handleSkipOrGetStarted} onGetStarted={handleSkipOrGetStarted} />
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                ref={flatListRef}
                data={champions}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                contentContainerStyle={styles.list}
                onEndReached={loadMoreChampions}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
              />
            )} 
          </View>
          <View style={styles.buttonContainer}>
          <Button title="Quay lại trang đầu" onPress={scrollToTop} color="#000000" />
            <Button title="Reset Onboarding" onPress={resetOnboarding} color="#000000" />
          </View>
        </View>
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ChampionList" component={ChampionList} options={{ title: 'League of Legends Champion List', 
        headerStyle: 
        { backgroundColor: '#2E8B57',},
        headerTitleStyle: {
          color: 'white', },
         }} />
        <Stack.Screen name="ChampionDetail" component={ChampionDetail} options={{ title: 'Champion Detail',
         }} />
      </Stack.Navigator>
    </NavigationContainer>
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
    backgroundColor: '#F0FFF0'
  },
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
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
  nameAndTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Tạo khoảng cách giữa tên và thẻ tags
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
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
    backgroundColor: '#2E8B57',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 10,
    color: 'white',
  },
  divider: {
    marginTop: 10,
  },
});

export default App;
