import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MetalCard from '../components/MetalCard';
import { getMetalPrice } from '../api/metals';

const METALS = [
  { name: 'Gold', symbol: 'XAU' },
  { name: 'Silver', symbol: 'XAG' },
  { name: 'Platinum', symbol: 'XPT' },
  { name: 'Palladium', symbol: 'XPD' },
];

export default function HomeScreen({ navigation }) {
  const [metalsData, setMetalsData] = useState(
    METALS.map(() => ({ loading: true, error: null, data: null, timestamp: null }))
  );

  useEffect(() => {
    METALS.forEach((metal, idx) => {
      fetchMetal(idx, metal.symbol);
    });
  }, []);

  const fetchMetal = async (idx, symbol) => {
    setMetalsData(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], loading: true, error: null };
      return copy;
    });
    const { data, error } = await getMetalPrice(symbol, 'INR');
    setMetalsData(prev => {
      const copy = [...prev];
      copy[idx] = {
        loading: false,
        error,
        data,
        timestamp: data ? new Date().toLocaleString('en-IN') : null,
      };
      return copy;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {METALS.map((metal, idx) => (
        <MetalCard
          key={metal.symbol}
          name={metal.name}
          price={metalsData[idx].data?.price}
          timestamp={metalsData[idx].timestamp}
          loading={metalsData[idx].loading}
          error={metalsData[idx].error}
          onPress={() => {
            if (metalsData[idx].data) {
              navigation.navigate('Details', {
                metal: metal.name,
                symbol: metal.symbol,
                data: metalsData[idx].data,
                timestamp: metalsData[idx].timestamp,
              });
            }
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5',
  },
});
