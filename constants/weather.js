import axios from "axios";

export const getWeatherByLocality=async(localityId)=>{
    try {
       const response = await axios.get(`https://weatherunion.com/gw/weather/external/v0/get_locality_weather_data`, {
        headers:{
            'content-type': 'application/json',
            'x-zomato-api-key' : '432b7b007db92dc147c317829c62c231'
        },
        params:{
            locality_id: localityId
        },
       })
       return response.data;

    } catch (error) {
        console.error('Error fetching weather data:', error);
         throw error; 
    }
}

// getWeatherByLocality('ZWL001089')
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Error fetching weather data:', error);
//   });
