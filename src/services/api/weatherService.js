// Mock weather service - replace with actual weather API integration
const mockWeatherData = [
  {
    day: "Mon",
    location: "Farm Location",
    temperature: 72,
    feelsLike: 70,
    condition: "sunny",
    humidity: 45,
    windSpeed: 8,
    high: 75,
    low: 62
  },
  {
    day: "Tue",
    location: "Farm Location",
    temperature: 68,
    feelsLike: 66,
    condition: "cloudy",
    humidity: 55,
    windSpeed: 12,
    high: 70,
    low: 58
  },
  {
    day: "Wed",
    location: "Farm Location",
    temperature: 65,
    feelsLike: 63,
    condition: "rainy",
    humidity: 75,
    windSpeed: 15,
    high: 67,
    low: 55
  },
  {
    day: "Thu",
    location: "Farm Location",
    temperature: 70,
    feelsLike: 68,
    condition: "cloudy",
    humidity: 60,
    windSpeed: 10,
    high: 73,
    low: 60
  },
  {
    day: "Fri",
    location: "Farm Location",
    temperature: 75,
    feelsLike: 73,
    condition: "sunny",
    humidity: 40,
    windSpeed: 6,
    high: 78,
    low: 64
  },
  {
    day: "Sat",
    location: "Farm Location",
    temperature: 76,
    feelsLike: 74,
    condition: "sunny",
    humidity: 38,
    windSpeed: 5,
    high: 80,
    low: 66
  },
  {
    day: "Sun",
    location: "Farm Location",
    temperature: 74,
    feelsLike: 72,
    condition: "cloudy",
    humidity: 50,
    windSpeed: 9,
    high: 77,
    low: 63
  }
];

export const weatherService = {
  /**
   * Fetches the weekly weather forecast
   * @returns {Promise<Array>} Array of weather data for 7 days
   */
  async getWeeklyForecast() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data - replace with actual API call
      return mockWeatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  },

  /**
   * Fetches today's weather data
   * @returns {Promise<Object>} Today's weather data
   */
  async getTodayWeather() {
    try {
      const forecast = await this.getWeeklyForecast();
      return forecast[0];
    } catch (error) {
      console.error('Error fetching today\'s weather:', error);
      throw new Error('Failed to fetch today\'s weather');
    }
  }
};