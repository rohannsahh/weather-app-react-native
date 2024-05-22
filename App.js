import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View ,ScrollView,Dimensions,ActivityIndicator} from 'react-native';
import{SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context'
import localities from './constants/localities.js';
import { getWeatherByLocality } from './constants/weather.js';
import {Picker} from '@react-native-picker/picker';
import MapView, { Marker ,PROVIDER_GOOGLE } from 'react-native-maps';
//import {MaterialCommunityIcons} from 'react-native-vector-icons'

export default function App() {
const [selectedCity, setSelectedCity] = useState(localities[0].cityName);
const [selectedLocality, setSelectedLocality] = useState(localities[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [region, setRegion] = useState({
    latitude: localities[0].latitude,
    longitude: localities[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

   const handleCityChange = (city) => {
    setSelectedCity(city);
    const locality = localities.find(locality => locality.cityName === city);
    setSelectedLocality(locality);
    fetchWeatherData(locality.localityId);
    updateRegion(locality);

  };

  const handleLocalityChange = (localityName) => {
    const locality = localities.find(loc => loc.localityName === localityName);
    setSelectedLocality(locality);
    fetchWeatherData(locality.localityId);
    updateRegion(locality);

  };

  const updateRegion = (locality) => {
    setRegion({
      latitude: locality.latitude,
      longitude: locality.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

const fetchWeatherData = async (localityId) => {
  try {
    const data = await getWeatherByLocality(localityId);
    setWeatherData(data.locality_weather_data);
    setIsLoading(false);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
  };
  useEffect(() => {
    fetchWeatherData(selectedLocality.localityId);
  }, [selectedLocality]);


  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
    {isLoading ? (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.title}>Weather Union Api by</Text>
              <Text style={styles.loadingText}>Zomato</Text>
            </View>
        ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Check live weather in your area</Text>
      <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCity}
              style={styles.picker}
              onValueChange={(itemValue) => handleCityChange(itemValue)}
            >
              {Array.from(new Set(localities.map(locality => locality.cityName))).map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedLocality.localityName}
              style={styles.picker}
              onValueChange={(itemValue) => handleLocalityChange(itemValue)}
            >
              {localities.filter(locality => locality.cityName === selectedCity).map((locality, index) => (
                <Picker.Item key={index} label={locality.localityName} value={locality.localityName} />
              ))}
            </Picker>
          </View>
          <View style={styles.map}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{
                  width:Dimensions.get('screen').width*0.89,
                  height:Dimensions.get('screen').height*0.24,
                }}
                region={region}
              >
                <Marker
                  coordinate={{
                    latitude: selectedLocality.latitude,
                    longitude: selectedLocality.longitude,
                  }}
                  title={selectedLocality.localityName}
                  description={`Weather: ${weatherData?.temperature}°C`}
                />
              </MapView>
            </View>
          {weatherData && (
            <View style={styles.weatherDetails}>
              <Text style={{fontSize:20, fontWeight:'bold',marginBottom: 5}}>Live Weather</Text>
              <Text style={styles.weatherText}>Temperature: {weatherData.temperature}°C</Text>
              <Text style={styles.weatherText}>Rain Intensity: {weatherData.rain_intensity} mm/min</Text>
              <Text style={styles.weatherText}>Rain Accumulation: {weatherData.rain_accumulation} </Text>
              <Text style={styles.weatherText}>Humidity: {weatherData.humidity}%</Text>
              <Text style={styles.weatherText}>Wind Speed: {weatherData.wind_speed} m/s</Text>
              <Text style={styles.weatherText}>Wind Direction: {weatherData.wind_direction}</Text>
              {/* <View >
          <MaterialCommunityIcons name="water-percent" size={50} color="black" />
          <Text style={styles.weatherText}>Humidity: {weatherData.humidity}%</Text>
        </View> */}
            </View>
          )}
          </View>
       )}    
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    
    fontSize: 50,
    color: 'red',
    fontWeight:'bold'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginHorizontal: 10,
  },
  
  map: {
    marginBottom: 20,
    borderRadius:20,
    overflow:'hidden',
  },
  weatherDetails: {
    width: Dimensions.get('screen').width*0.83,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 5,
  },
  chartContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
