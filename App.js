import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Modal, TouchableOpacity, Picker, TextInput } from 'react-native';
import MetalCard from './components/MetalCard';
import { getMetalPrice } from './api/metals';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

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
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);
  const [currencySearchText, setCurrencySearchText] = useState('');

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  // Filter currencies based on search text
  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(currencySearchText.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearchText.toLowerCase())
  );

  useEffect(() => {
    // Add delay between API calls to avoid rate limiting
    METALS.forEach((metal, idx) => {
      setTimeout(() => {
        fetchMetal(idx, metal.symbol);
      }, idx * 1000); // 1 second delay between each call
    });
  }, [selectedCurrency]);

  const fetchMetal = async (idx, symbol) => {
    setMetalsData(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], loading: true, error: null };
      return copy;
    });
    const { data, error } = await getMetalPrice(symbol, selectedCurrency);
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MetaloTrack</Text>
          <Text style={styles.headerSubtitle}>Professional Metal Price Tracker</Text>
        </View>
        <TouchableOpacity 
          style={styles.currencyButton}
          onPress={() => setCurrencyPickerVisible(true)}
        >
          <Text style={styles.currencyButtonText}>
            {currentCurrency.symbol} {currentCurrency.code}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {METALS.map((metal, idx) => (
            <View key={metal.symbol} style={styles.cardWrapper}>
              <MetalCard
                name={metal.name}
                price={metalsData[idx].data?.price}
                timestamp={metalsData[idx].timestamp}
                loading={metalsData[idx].loading}
                error={metalsData[idx].error}
                onPress={() => handleCardPress(metal, idx)}
                currencySymbol={currentCurrency.symbol}
              />
            </View>
          ))}
        </View>
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
                  <Text style={styles.label}>Current Price (Per Troy Ounce):</Text>
                  <Text style={styles.value}>{currentCurrency.symbol} {selectedMetal.data?.price?.toLocaleString('en-IN') || '--'}</Text>
                  
                  <Text style={styles.label}>Price for 10 Grams:</Text>
                  <Text style={styles.value}>{currentCurrency.symbol} {selectedMetal.data?.price ? (selectedMetal.data.price / 31.1035 * 10).toLocaleString('en-IN', {maximumFractionDigits: 0}) : '--'}</Text>
                  
                  <Text style={styles.label}>Price for 1 Gram:</Text>
                  <Text style={styles.value}>{currentCurrency.symbol} {selectedMetal.data?.price ? (selectedMetal.data.price / 31.1035).toLocaleString('en-IN', {maximumFractionDigits: 0}) : '--'}</Text>
                  
                  <Text style={styles.label}>Previous Close:</Text>
                  <Text style={styles.value}>{currentCurrency.symbol} {selectedMetal.data?.prev_close_price?.toLocaleString('en-IN') || '--'}</Text>
                  <Text style={styles.label}>Previous Open:</Text>
                  <Text style={styles.value}>{currentCurrency.symbol} {selectedMetal.data?.prev_open_price?.toLocaleString('en-IN') || '--'}</Text>
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

      {/* Currency Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={currencyPickerVisible}
        onRequestClose={() => {
          setCurrencyPickerVisible(false);
          setCurrencySearchText('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.currencyModalContent}>
            <Text style={styles.currencyModalTitle}>Select Currency</Text>
            
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search currencies..."
                placeholderTextColor="#999"
                value={currencySearchText}
                onChangeText={setCurrencySearchText}
                autoCapitalize="none"
              />
            </View>
            
            <ScrollView style={styles.currencyList}>
              {filteredCurrencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    selectedCurrency === currency.code && styles.selectedCurrencyItem
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency.code);
                    setCurrencyPickerVisible(false);
                    setCurrencySearchText('');
                  }}
                >
                  <View style={styles.currencyItemContent}>
                    <Text style={[
                      styles.currencySymbol,
                      selectedCurrency === currency.code && styles.selectedCurrencyText
                    ]}>
                      {currency.symbol}
                    </Text>
                    <View style={styles.currencyInfo}>
                      <Text style={[
                        styles.currencyCode,
                        selectedCurrency === currency.code && styles.selectedCurrencyText
                      ]}>
                        {currency.code}
                      </Text>
                      <Text style={[
                        styles.currencyName,
                        selectedCurrency === currency.code && styles.selectedCurrencyText
                      ]}>
                        {currency.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => {
                setCurrencyPickerVisible(false);
                setCurrencySearchText('');
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: '#1E3A8A', // Professional blue
    paddingVertical: 24,
    paddingHorizontal: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 100,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    flexShrink: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#93C5FD',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  currencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 60,
    alignItems: 'center',
  },
  currencyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
    minWidth: 150,
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
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
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
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '95%',
    maxHeight: '85%',
    maxWidth: 400,
  },
  currencyModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#333',
  },
  currencyList: {
    maxHeight: 350,
    flexGrow: 0,
  },
  currencyItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedCurrencyItem: {
    backgroundColor: '#1E3A8A',
    borderBottomColor: 'transparent',
  },
  currencyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginRight: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCurrencyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
