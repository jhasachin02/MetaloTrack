import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import MetalCard from './components/MetalCard';
import { getMetalPrice } from './api/metals';

const METALS = [
  { name: 'Gold', symbol: 'XAU' },
  { name: 'Silver', symbol: 'XAG' },
  { name: 'Platinum', symbol: 'XPT' },
  { name: 'Palladium', symbol: 'XPD' },
];

export default function App() {
  const [metalsData, setMetalsData] = useState(
    METALS.map(() => ({ loading: true, error: null, data: null, timestamp: null }))
  );
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleCardPress = (metal, idx) => {
    if (metalsData[idx].data) {
      setSelectedMetal({
        metal: metal.name,
        symbol: metal.symbol,
        data: metalsData[idx].data,
        timestamp: metalsData[idx].timestamp,
      });
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MetaloTrack</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {METALS.map((metal, idx) => (
          <MetalCard
            key={metal.symbol}
            name={metal.name}
            price={metalsData[idx].data?.price}
            timestamp={metalsData[idx].timestamp}
            loading={metalsData[idx].loading}
            error={metalsData[idx].error}
            onPress={() => handleCardPress(metal, idx)}
          />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMetal && (
              <>
                <Text style={styles.modalTitle}>{selectedMetal.metal}</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.label}>Current Price:</Text>
                  <Text style={styles.value}>₹ {selectedMetal.data?.price?.toLocaleString('en-IN') || '--'}</Text>
                  <Text style={styles.label}>Previous Close:</Text>
                  <Text style={styles.value}>₹ {selectedMetal.data?.prev_close_price?.toLocaleString('en-IN') || '--'}</Text>
                  <Text style={styles.label}>Previous Open:</Text>
                  <Text style={styles.value}>₹ {selectedMetal.data?.prev_open_price?.toLocaleString('en-IN') || '--'}</Text>
                  <Text style={styles.label}>Fetched At:</Text>
                  <Text style={styles.value}>{selectedMetal.timestamp || '--'}</Text>
                  <Text style={styles.label}>Today:</Text>
                  <Text style={styles.value}>{new Date().toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'stretch',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
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
  closeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
