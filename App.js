//http://172.17.2.84:8000/api/test
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('://172.17.2.84:8000/api/test'); // 5 seconds timeout
                setData(response.data.info);
            } catch (err) {
                console.error(err);
                if (err.code === 'ECONNABORTED') {
                    setError('Request timed out. Please try again later.');
                } else {
                    setError('Failed to fetch data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.text}>{error}</Text>
            ) : (
                <Text style={styles.text}>{data ? data : 'No data found'}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
