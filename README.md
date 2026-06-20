# 🌤️ Weather App

A modern and fast web application to track Turkey's weather in real-time.

## ✨ Features

- 🔍 **City Search**: Search for any Turkish city to check its weather
- 📍 **Popular Cities**: View weather for Turkey's major cities at a glance
- 📊 **5-Day Forecast**: Detailed 5-day weather forecast for selected cities
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI**: Minimal and aesthetic interface

## 🛠️ Technologies

- **HTML5**: Page structure
- **CSS3**: Modern styling and responsive design
- **JavaScript (ES6+)**: Application logic
- **OpenWeatherMap API**: Real-time weather data

## 📡 API Usage

This application uses **3 main endpoints** from OpenWeatherMap API:

### 1. Geocoding API - Finding City Coordinates
```javascript
const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},TR&limit=1&appid=${Key}`;
```

**Purpose**: Converts city name to latitude/longitude coordinates.

**Parameters**:
- `q`: City name (URL-encoded)
- `TR`: Country code (Turkey)
- `limit`: Result limit (1 = only the best match)
- `appid`: API key

**Return Value**: City name, latitude (lat), longitude (lon)

**Example Response**:
```json
[{
  "name": "Istanbul",
  "lat": 41.0082,
  "lon": 28.9784
}]
```

### 2. Current Weather API - Real-time Weather
```javascript
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Key}&lang=${Lang}&units=${Units}`;
```

**Purpose**: Fetches current weather conditions for specified coordinates.

**Parameters**:
- `lat`: Latitude
- `lon`: Longitude
- `lang`: Language (en = English)
- `units`: Temperature unit (metric = Celsius)
- `appid`: API key

**Return Value**: Temperature, weather description, weather icon, and more

**Example Response**:
```json
{
  "main": {
    "temp": 22.5,
    "feels_like": 21.8,
    "humidity": 65
  },
  "weather": [{
    "icon": "02d",
    "description": "partly cloudy"
  }]
}
```

### 3. Forecast API - 5-Day Forecast
```javascript
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},TR&appid=${Key}&lang=${Lang}&units=${Units}`;
```

**Purpose**: Retrieves 5-day weather forecast for the selected city.

**Parameters**:
- `q`: City name (format: city,countrycode)
- `lang`: Language (en = English)
- `units`: Temperature unit (metric = Celsius)
- `appid`: API key

**Return Value**: 5-day forecast data, updated every 3 hours

## 🚀 Getting Started

1. **Create OpenWeatherMap Account**: https://openweathermap.org/api
2. **Get Your API Key**: Log in and copy your API key
3. **Update the Key**: Replace the `Key` variable in `index.js`
4. **Open in Browser**: Open `index.html` in your browser

```javascript
// Update this line in index.js
const Key = "your-api-key-here";
```

## 📋 Constants

```javascript
const Key = "API_KEY";                 // OpenWeatherMap API key
const Lang = "en";                     // Language (en = English)
const Units = "metric";                // Temperature unit (Celsius)
const Batch = 12;                      // Number of cities shown per page
```

## 📁 Project Structure

```
Weather-App/
├── index.html      # HTML structure
├── index.js        # JavaScript logic and API calls
├── style.css       # Styling
└── README.md       # This file
```

## 🔄 Data Flow

```
User Search
    ↓
City Name → Geocoding API → Coordinates (lat/lon)
    ↓
Coordinates → Current Weather API → Current Conditions
    ↓
City Name → Forecast API → 5-Day Forecast
    ↓
UI Update → Display Results
```

## 💡 Code Examples

### Fetching Weather
```javascript
async function current(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Key}&lang=${Lang}&units=${Units}`;
  return await jsonFetch(url);
}
```

### Searching for a City
```javascript
async function geo(city){
  const q = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q},TR&limit=1&appid=${Key}`;
  const data = await jsonFetch(url);
  if(!data || data.length === 0) return null;
  return { name: data[0].name, lat: data[0].lat, lon: data[0].lon };
}
```

### Error Handling
```javascript
async function jsonFetch(url){
  const response = await fetch(url);
  if(!response.ok) throw new Error("Request error: " + response.status);
  return await response.json();
}
```

## 🌍 Supported Cities

All 81 provinces of Turkey are supported: Istanbul, Ankara, Izmir, Bursa, Antalya, and more.

**Popular Cities**: Istanbul, Ankara, Izmir, Bursa, Antalya, Adana, Trabzon, Gaziantep, Kayseri, Konya, Mersin, Diyarbakir, Tekirdag

## 📱 Responsive Breakpoints

- Mobile: `≤ 700px` (8 cities per row)
- Tablet/Desktop: `> 700px` (12 cities per row)

## 🎓 Things Learned

Through this project, I learned:

✅ **Async/Await Usage**: Handling asynchronous API calls and error management
✅ **REST API Integration**: Working with external APIs
✅ **DOM Manipulation**: Creating and updating dynamic HTML
✅ **Responsive Web Design**: Adapting to different screen sizes
✅ **URL Encoding**: Using `encodeURIComponent()` for special characters
✅ **Event Handling**: Form submission, button clicks, and dynamic events
✅ **Modern CSS**: CSS variables and gradients

## 🔗 Useful Links

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Geocoding API Guide](https://openweathermap.org/api/geocoding-api)
- [Current Weather API Guide](https://openweathermap.org/current)
- [Forecast API Guide](https://openweathermap.org/forecast5)

## 📝 License

This project was created for personal learning purposes.

---

**Developer**: Diyar Sarı | **Date**: 2026
