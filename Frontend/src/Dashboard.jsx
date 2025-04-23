import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Sun, Droplet, Info, X, ArrowUpCircle, ArrowDownCircle, Minus, Navigation, Thermometer } from 'lucide-react';

// Sample data - in a real app this would be loaded from data.json
const sampleData = [
  { timestamp: "2025-04-22T09:00:00", temperature: 26, humidity: 40 },
  { timestamp: "2025-04-22T10:00:00", temperature: 28, humidity: 42 },
  { timestamp: "2025-04-22T11:00:00", temperature: 30, humidity: 38 },
  { timestamp: "2025-04-22T12:00:00", temperature: 34, humidity: 36 }
];

export default function WeatherDashboard() {
  const [data, setData] = useState(sampleData);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [currentReadings, setCurrentReadings] = useState(null);
  const [previousReadings, setPreviousReadings] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day', 'sunset', 'night'

  // References for tour highlighting
  const navbarRef = useRef(null);
  const currentReadingsRef = useRef(null);
  const temperatureCardRef = useRef(null);
  const humidityCardRef = useRef(null);
  const chartsRef = useRef(null);
  const comparisonRef = useRef(null);

  useEffect(() => {
    // Simulate loading data
    const lastReading = data[data.length - 1];
    const previousReading = data.length > 1 ? data[data.length - 2] : null;
    setCurrentReadings(lastReading);
    setPreviousReadings(previousReading);

    // Set time of day based on current hour
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) {
      setTimeOfDay('day');
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay('sunset');
    } else {
      setTimeOfDay('night');
    }

    // Simulate new data coming in every 30 seconds
    const interval = setInterval(() => {
      const newReading = {
        timestamp: new Date().toISOString(),
        temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
        humidity: Math.floor(Math.random() * 20) + 30,    // 30-50%
      };
      
      setData(prevData => {
        const updatedData = [...prevData, newReading];
        // Keep only the last 24 readings
        if (updatedData.length > 24) {
          return updatedData.slice(updatedData.length - 24);
        }
        return updatedData;
      });
      
      setPreviousReadings(currentReadings);
      setCurrentReadings(newReading);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const tourSteps = [
    { 
      target: navbarRef, 
      title: 'Welcome to WeatherVerse', 
      description: 'Your real-time weather monitoring dashboard that displays data from your Arduino sensors'
    },
    { 
      target: currentReadingsRef, 
      title: 'Current Readings', 
      description: 'This section displays the latest temperature and humidity readings for quick reference'
    },
    { 
      target: temperatureCardRef, 
      title: 'Temperature Card', 
      description: 'This card shows the current temperature with dynamic coloring based on the value. Watch for heat wave animations when temperatures rise!'
    },
    { 
      target: humidityCardRef, 
      title: 'Humidity Card', 
      description: 'Monitor humidity levels in real-time with visual indicators and animations that appear when humidity is high'
    },
    { 
      target: chartsRef, 
      title: 'Historical Trends', 
      description: 'These charts show temperature and humidity trends over time so you can track changes'
    },
    { 
      target: comparisonRef, 
      title: 'Data Comparison', 
      description: 'Compare current readings with previous values to see how conditions are changing'
    }
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getTemperatureColor = (temp) => {
    if (temp < 28) return 'text-blue-500';
    if (temp > 32) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getTemperatureCardColor = (temp) => {
    if (temp < 28) return 'bg-blue-50 border-blue-200';
    if (temp > 32) return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const renderChangeIndicator = (current, previous, unit) => {
    if (!previous) return null;
    
    const diff = current - previous;
    if (diff > 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowUpCircle size={16} className="mr-1" />
          <span>+{diff.toFixed(1)}{unit}</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowDownCircle size={16} className="mr-1" />
          <span>{diff.toFixed(1)}{unit}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus size={16} className="mr-1" />
          <span>No change</span>
        </div>
      );
    }
  };

  const startTour = () => {
    setShowTour(true);
    setTourStep(0);
  };

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const closeTour = () => {
    setShowTour(false);
  };

  // Function to calculate the tour overlay position
  const getTourOverlayPosition = (step) => {
    if (!tourSteps[step] || !tourSteps[step].target.current) return {};
    
    const element = tourSteps[step].target.current;
    const rect = element.getBoundingClientRect();
    
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  };

  // Function to scroll to the target element
  const scrollToTarget = () => {
    if (!tourSteps[tourStep] || !tourSteps[tourStep].target.current) return;
    
    const element = tourSteps[tourStep].target.current;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Scroll to target when tour step changes
  useEffect(() => {
    if (showTour) {
      scrollToTarget();
    }
  }, [tourStep, showTour]);

  if (!currentReadings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Weather background based on time of day
  const getWeatherBackground = () => {
    switch (timeOfDay) {
      case 'day':
        return 'bg-gradient-to-b from-blue-50 to-blue-100';
      case 'sunset':
        return 'bg-gradient-to-b from-orange-50 to-blue-100';
      case 'night':
        return 'bg-gradient-to-b from-blue-900 to-gray-900';
      default:
        return 'bg-gray-50';
    }
  };

  const textColor = timeOfDay === 'night' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className={`min-h-screen ${getWeatherBackground()}`}>
      {/* Floating Weather Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Clouds */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="absolute top-10 left-0"
        >
          <div className="w-16 h-8 bg-white rounded-full opacity-30"></div>
        </motion.div>
        
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 180, ease: "linear", delay: 20 }}
          className="absolute top-24 left-0"
        >
          <div className="w-24 h-12 bg-white rounded-full opacity-20"></div>
        </motion.div>
        
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 150, ease: "linear", delay: 50 }}
          className="absolute top-40 left-0"
        >
          <div className="w-12 h-6 bg-white rounded-full opacity-25"></div>
        </motion.div>
        
        {/* Sun or Moon based on time of day */}
        {timeOfDay === 'day' && (
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: -20 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 10, ease: "easeInOut" }}
            className="absolute top-16 right-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
            >
              <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-50"></div>
            </motion.div>
          </motion.div>
        )}
        
        {timeOfDay === 'night' && (
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: -20 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 10, ease: "easeInOut" }}
            className="absolute top-16 right-16"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 opacity-50"></div>
          </motion.div>
        )}
        
        {/* Floating temperature indicator */}
        <motion.div
          initial={{ y: 0, opacity: 0.5 }}
          animate={{ y: -20, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, ease: "easeInOut", delay: 2 }}
          className="absolute top-64 left-16"
        >
          <Thermometer size={30} className="text-red-400 opacity-60" />
        </motion.div>
        
        {/* Floating droplets */}
        <motion.div
          initial={{ y: 0, opacity: 0.5 }}
          animate={{ y: 30, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeIn" }}
          className="absolute top-48 right-32"
        >
          <Droplet size={16} className="text-blue-400 opacity-60" />
        </motion.div>
        
        <motion.div
          initial={{ y: 0, opacity: 0.5 }}
          animate={{ y: 30, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeIn", delay: 2 }}
          className="absolute top-56 right-48"
        >
          <Droplet size={12} className="text-blue-400 opacity-60" />
        </motion.div>
      </div>
      
      {/* Navbar */}
      <nav ref={navbarRef} className="bg-white shadow-sm px-6 py-4 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sun size={28} className="text-yellow-500 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">WeatherVerse</h1>
          </div>
          <button 
            onClick={startTour}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <Navigation size={16} className="mr-2" />
            Take a Tour
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className={`text-xl font-medium ${textColor}`}>Welcome to your personal weather station</h2>
          <p className={timeOfDay === 'night' ? 'text-gray-400' : 'text-gray-500'}>
            Monitor temperature and humidity data collected from your Arduino sensors
          </p>
        </motion.div>

        {/* Current Readings Section */}
        <section ref={currentReadingsRef} className="mb-8">
          <h3 className={`text-lg font-medium ${textColor} mb-4`}>Current Readings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Card */}
            <motion.div
              ref={temperatureCardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`rounded-lg shadow-sm p-6 border ${getTemperatureCardColor(currentReadings.temperature)}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-gray-600 mb-1">Temperature</h4>
                  <div className="flex items-center">
                    <Thermometer size={24} className={`${getTemperatureColor(currentReadings.temperature)} mr-2`} />
                    <span className={`text-3xl font-bold ${getTemperatureColor(currentReadings.temperature)}`}>
                      {currentReadings.temperature}°C
                    </span>
                  </div>
                  <div className="mt-2">
                    {renderChangeIndicator(currentReadings.temperature, previousReadings?.temperature, '°C')}
                  </div>
                </div>
                
                {/* Heat Wave Effect when very hot */}
                {currentReadings.temperature > 32 && (
                  <div className="relative">
                    <motion.div
                      animate={{ opacity: [0.5, 0.8, 0.5], y: [-3, -6, -3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-0 right-0 w-12 h-12 bg-red-400 rounded-full blur-xl"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Last updated: {formatTime(currentReadings.timestamp)}
              </div>
            </motion.div>

            {/* Humidity Card */}
            <motion.div
              ref={humidityCardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-gray-600 mb-1">Humidity</h4>
                  <div className="flex items-center">
                    <Droplet size={24} className="text-blue-500 mr-2" />
                    <span className="text-3xl font-bold text-blue-500">
                      {currentReadings.humidity}%
                    </span>
                  </div>
                  <div className="mt-2">
                    {renderChangeIndicator(currentReadings.humidity, previousReadings?.humidity, '%')}
                  </div>
                </div>
                
                {/* Droplet Animations when humidity is high */}
                {currentReadings.humidity > 40 && (
                  <div className="relative">
                    <div className="flex">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, 15, 0], 
                            opacity: [0.7, 1, 0.7],
                            scale: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2 + i*0.5, 
                            delay: i*0.3 
                          }}
                          className="ml-1"
                        >
                          <Droplet size={i*4 + 10} className="text-blue-300" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Last updated: {formatTime(currentReadings.timestamp)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Charts Section */}
        <section ref={chartsRef} className="mb-8">
          <h3 className={`text-lg font-medium ${textColor} mb-4`}>Historical Trends</h3>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="h-64 mb-8">
              <h4 className="text-gray-600 mb-3">Temperature Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    tick={{ fontSize: 12 }}
                    label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}°C`, 'Temperature']}
                    labelFormatter={(label) => `Time: ${formatTime(label)}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f59e0b" 
                    fill="#fef3c7" 
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-64">
              <h4 className="text-gray-600 mb-3">Humidity Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                    label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Humidity']}
                    labelFormatter={(label) => `Time: ${formatTime(label)}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    fill="#dbeafe" 
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        {previousReadings && (
          <section ref={comparisonRef} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-medium ${textColor}`}>Data Comparison</h3>
              <div className="text-sm text-gray-500">
                Comparing current with previous reading
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                  <span>Current ({formatTime(currentReadings.timestamp)})</span>
                  <span>Previous ({formatTime(previousReadings.timestamp)})</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Temperature (°C)',
                        current: currentReadings.temperature,
                        previous: previousReadings.temperature
                      },
                      {
                        name: 'Humidity (%)',
                        current: currentReadings.humidity,
                        previous: previousReadings.humidity
                      }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="current" 
                      name="Current" 
                      fill="#3b82f6" 
                      animationDuration={500} 
                    />
                    <Bar 
                      dataKey="previous" 
                      name="Previous" 
                      fill="#93c5fd" 
                      animationDuration={500} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      {/* Tour Overlay - FIXED: Changed to use spotlight effect instead of dimming the whole screen */}
      <AnimatePresence>
        {showTour && (
          <>
            {/* Semi-transparent overlay with spotlight cutout */}
            <div 
              className="fixed inset-0 z-40 pointer-events-none"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                // The following creates a spotlight effect using multiple box-shadows
                boxShadow: tourSteps[tourStep]?.target?.current ? 
                  `inset 0 0 0 9999px rgba(0, 0, 0, 0.5)` : 'none'
              }}
            >
              {/* This div creates the spotlight effect */}
              {tourSteps[tourStep]?.target?.current && (
                <div
                  className="absolute bg-transparent"
                  style={{
                    top: getTourOverlayPosition(tourStep).top,
                    left: getTourOverlayPosition(tourStep).left,
                    width: getTourOverlayPosition(tourStep).width,
                    height: getTourOverlayPosition(tourStep).height,
                    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
                    // This makes the cutout transparent
                    backgroundColor: 'transparent'
                  }}
                />
              )}
            </div>
                
            {/* Highlighted border around current element */}
            {tourSteps[tourStep]?.target?.current && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-50 border-2 border-blue-400 rounded-md pointer-events-none"
                style={{
                  top: getTourOverlayPosition(tourStep).top - 4,
                  left: getTourOverlayPosition(tourStep).left - 4,
                  width: getTourOverlayPosition(tourStep).width + 8,
                  height: getTourOverlayPosition(tourStep).height + 8,
                }}
              />
            )}
            
            {/* Tour dialog - repositioned for better visibility */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4"
              >
                <button 
                  onClick={closeTour}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                <div className="mb-4 flex items-center">
                  <Info size={24} className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-medium">{tourSteps[tourStep].title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{tourSteps[tourStep].description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Step {tourStep + 1} of {tourSteps.length}
                  </div>
                  <div className="flex">
                    {tourStep > 0 && (
                      <button
                        onClick={prevTourStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm mr-2"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={nextTourStep}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      {tourStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}