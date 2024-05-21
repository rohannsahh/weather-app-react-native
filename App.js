import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View ,ScrollView} from 'react-native';
import{SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context'
import localities from './constants/localities.js';
import { getWeatherByLocality } from './constants/weather.js';
import {Picker} from '@react-native-picker/picker';
import MapView, { Marker ,PROVIDER_GOOGLE } from 'react-native-maps';


export default function App() {
const [selectedCity, setSelectedCity] = useState(localities[0].cityName);
const [selectedLocality, setSelectedLocality] = useState(localities[0]);
  const [weatherData, setWeatherData] = useState(null);


   const handleCityChange = (city) => {
    setSelectedCity(city);
    const locality = localities.find(locality => locality.cityName === city);
    setSelectedLocality(locality);
    fetchWeatherData(locality.localityId);
  };

  const handleLocalityChange = (localityName) => {
    const locality = localities.find(loc => loc.localityName === localityName);
    setSelectedLocality(locality);
    fetchWeatherData(locality.localityId);
  };
const fetchWeatherData = async (localityId) => {
    try {
      const data = await getWeatherByLocality(localityId);
      setWeatherData(data.locality_weather_data);
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
          <MapView
          provider={PROVIDER_GOOGLE}

        style={styles.map}
        initialRegion={{
          latitude: selectedLocality.latitude,
          longitude: selectedLocality.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
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
          {weatherData && (
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherText}>Live Weather:</Text>
              <Text style={styles.weatherText}>Temperature: {weatherData.temperature}°C</Text>
              <Text style={styles.weatherText}>Rain Intensity: {weatherData.rain_intensity} mm/min</Text>
              <Text style={styles.weatherText}>Humidity: {weatherData.humidity}%</Text>
              <Text style={styles.weatherText}>Wind Speed: {weatherData.wind_speed} m/s</Text>
            </View>
          )}
          



    </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    marginHorizontal: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  weatherDetails: {
    width: '100%',
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
