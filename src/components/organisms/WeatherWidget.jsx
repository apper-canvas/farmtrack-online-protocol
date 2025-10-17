import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";

const WeatherWidget = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getWeeklyForecast();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      snowy: "CloudSnow",
      stormy: "Zap"
    };
    return iconMap[condition] || "Cloud";
  };

  if (loading) return <Loading type="weather" />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  const today = weather[0];
  if (!today) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-info to-secondary-400 text-white p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Today's Weather</h3>
              <p className="text-white/80 text-sm">{today.location}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{today.temperature}°F</div>
              <div className="text-white/80 text-sm capitalize">{today.condition}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <ApperIcon name={getWeatherIcon(today.condition)} className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-white/80">Feels like {today.feelsLike}°F</div>
                <div className="text-sm text-white/80">Humidity {today.humidity}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Wind</div>
              <div className="font-semibold">{today.windSpeed} mph</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {weather.slice(0, 5).map((day, index) => (
              <motion.div
                key={index}
                className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-xs text-white/80 mb-1">{day.day}</div>
                <ApperIcon name={getWeatherIcon(day.condition)} className="h-5 w-5 mx-auto mb-1 text-white" />
                <div className="text-xs font-medium">{day.high}°</div>
                <div className="text-xs text-white/60">{day.low}°</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;