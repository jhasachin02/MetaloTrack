import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

export default function MetalCard({ name, price, timestamp, loading, error, onPress, currencySymbol = '₹' }) {
  const priceFor10Grams = price ? (price / 31.1035 * 10) : null;
  const showGram = name !== 'Palladium';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" style={styles.spinner} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <Text style={styles.priceLabel}>Per Troy Ounce</Text>
            <Text style={styles.price}>{currencySymbol} {price ? price.toLocaleString('en-IN') : '--'}</Text>
            {showGram && <Text style={styles.gramLabel}>10 Grams</Text>}
            {showGram && <Text style={styles.gramPrice}>{currencySymbol} {priceFor10Grams ? priceFor10Grams.toLocaleString('en-IN', {maximumFractionDigits: 0}) : '--'}</Text>}
            <Text style={styles.timestamp}>{timestamp}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    minHeight: 160,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    textAlign: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
    textAlign: 'center',
  },
  gramLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 4,
  },
  gramPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
  },
  spinner: {
    marginVertical: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginVertical: 6,
    textAlign: 'center',
  },
});
