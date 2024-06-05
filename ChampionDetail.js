import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!championDetail) {
    return (
      <View style={styles.container}>
        <Text>Không có thông tin chi tiết.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{championDetail.name}</Text>
      <Text style={styles.subtitle}>{championDetail.title}</Text>
      <Text style={styles.blurb}>{championDetail.blurb}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Info</Text>
        <Text>Attack: {championDetail.info.attack}</Text>
        <Text>Defense: {championDetail.info.defense}</Text>
        <Text>Magic: {championDetail.info.magic}</Text>
        <Text>Difficulty: {championDetail.info.difficulty}</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.infoTitle}>Stats</Text>
        {Object.entries(championDetail.stats).map(([key, value]) => (
          <Text key={key}>{`${key}: ${value}`}</Text>
        ))}
      </View>
      <View style={styles.partypeContainer}>
        <Text style={styles.infoTitle}>Partype</Text>
        <Text>{championDetail.partype}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
  blurb: {
    fontSize: 14,
    marginVertical: 10,
  },
  infoContainer: {
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginVertical: 10,
  },
  partypeContainer: {
    marginVertical: 10,
  },
});

export default ChampionDetail;
