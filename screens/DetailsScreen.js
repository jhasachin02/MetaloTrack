import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  const { metal, symbol, data, timestamp } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{metal}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Current Price:</Text>
        <Text style={styles.value}>₹ {data?.price?.toLocaleString('en-IN') || '--'}</Text>
        <Text style={styles.label}>Previous Close:</Text>
        <Text style={styles.value}>₹ {data?.prev_close_price?.toLocaleString('en-IN') || '--'}</Text>
        <Text style={styles.label}>Previous Open:</Text>
        <Text style={styles.value}>₹ {data?.prev_open_price?.toLocaleString('en-IN') || '--'}</Text>
        <Text style={styles.label}>Fetched At:</Text>
        <Text style={styles.value}>{timestamp || '--'}</Text>
        <Text style={styles.label}>Today:</Text>
        <Text style={styles.value}>{new Date().toLocaleString('en-IN')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
