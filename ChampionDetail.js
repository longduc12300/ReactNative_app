import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';

const ChampionDetail = ({ route }) => {
  const { championId } = route.params;
  const [championDetail, setChampionDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChampionDetail = async () => {
      try {
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion/${championId}.json`);
        setChampionDetail(response.data.data[championId]);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    fetchChampionDetail();
  }, [championId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!championDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có thông tin chi tiết.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg` }}
        style={styles.imageBackground}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, styles.whiteText]}>{championDetail.name}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.subtitle, styles.whiteText]}>{championDetail.title}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.blurb, styles.whiteText]}>{championDetail.blurb}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoTitle, styles.whiteText]}>Thông Tin</Text>
            <Text style={styles.whiteText}>Đánh: {championDetail.info.attack}</Text>
            <Text style={styles.whiteText}>Phòng Thủ: {championDetail.info.defense}</Text>
            <Text style={styles.whiteText}>Ma Pháp: {championDetail.info.magic}</Text>
            <Text style={styles.whiteText}>Độ Khó: {championDetail.info.difficulty}</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={[styles.infoTitle, styles.whiteText]}>Thống Kê</Text>
            {Object.entries(championDetail.stats).map(([key, value]) => (
              <Text key={key} style={styles.whiteText}>{`${key}: ${value}`}</Text>
            ))}
          </View>
          <View style={styles.partypeContainer}>
            <Text style={[styles.infoTitle, styles.whiteText]}>Partype</Text>
            <Text style={styles.whiteText}>{championDetail.partype}</Text>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  textContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  blurb: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  partypeContainer: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },
  whiteText: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    padding: 5,
  },
});

export default ChampionDetail;
