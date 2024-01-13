import React from "react";
import Conversion from "./Conversion";
import './button.css';


export default function App(){

  const [location, setLocation] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [weatherData, setWeatherData] = React.useState(null);
  const [cityInput, setCityInput] = React.useState('');

  React.useEffect(() => {
    
    const fetchLocation = async () => {
      try {
        if ('geolocation' in navigator) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;

          const apiKey1 = process.env.REACT_APP_GEOCODE_API_KEY;

          const response = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey1}`
          );

          const data = await response.json();
          // console.log(data);

          setLocation(data.address.city);

          // go for the second fetch only after obtaining the location
          fetchWeatherData(data.address.city);
        } 
        
        else {
          setError('Geolocation is not supported by your browser');
        }

      } 

      catch (error) {
        setError(`Error getting location: ${error.message}`);
      }
    };

    const fetchWeatherData = async (city) => {
      try {
        const apiKey2 = process.env.REACT_APP_OPENWEATHER_API_KEY;

        const units = 'metric';

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey2}&units=${units}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setWeatherData(data);

        // console.log(data);

      } catch (error) {
        setError(`Error getting weather: ${error.message}`);
      }
    };
    fetchLocation();
  }, []);

  const handleCitySubmit = async(event) => {
    event.preventDefault();
    const apiKey2 = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const units = 'metric';

    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey2}&units=${units}`);

      if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json();
      setWeatherData(data);
      // console.log(data);

      setError(null);
    }
    catch(error) {
      setError(error.message);
    }
    //clear input field
    setCityInput('');
    //remove focus
    document.getElementById('weather-form').blur();

  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  
  return (
    <div className="app">
      <header>
        <div>
          {!location && <i className="material-icons">location_off</i>}
          { !location && weatherData && (
            <div>
              <h2>Weather In : {weatherData.name}, {weatherData.sys.country}</h2>
            </div>
          )}
          {location ? (
            <div className="location">             
              <h2><i className="material-icons">location_on</i> {location}</h2>
            </div>
          ) : error ? (
            <p>Can not get your location  </p>
          ) : (
            <div>
              <div className="loader"></div>
            </div>
          )}
        </div>
        <div className="date">
          <p><i className="material-icons">today</i> {formattedDate}</p>
        </div>
      </header>

      <div className="city-click">
        <h4>Get Weather By Name</h4>
        <form onSubmit={handleCitySubmit} className= "float-label">
        <input
        type="text"
        id="weather-form"
        value={cityInput}
        onChange={(event) => setCityInput(event.target.value)}
        placeholder=" "
        >
        </input>
        <label htmlFor="weather-form">
           City Name
        </label>
          <button className="cta" type="submit">
            <span>Get weather</span>
          </button>

        </form>
      </div>
      
      <div className="weather-data">
        {weatherData && (
          <div className="WD-details">
            <h2>Weather In : {weatherData.name} , {weatherData.sys.country}</h2>
            <div className="weather-temp">
              <div>
                <span>Temparetures</span>
                <p className="temparture">{weatherData.main.temp} <span>°C</span></p>
              </div>
              <div>
                <span>Feels Like</span>
                <p className="feels-like">{weatherData.main.feels_like} <span>°C</span></p>
              </div>
            </div>
            
            <div className="weather-type">
              <div>
                <span>Weather Type </span>
                <p>{weatherData.weather[0].description}</p>
              </div>
              <div>
                <span>Visibility </span>
                <p> {weatherData.visibility / 1000} km</p>
              </div>
            </div>
            

            <Conversion weatherData={weatherData} />
          </div>
        )}
      </div>

      <footer>
        <i className="material-icons">copyright</i>2024 HAFIZ AL ASAD
      </footer>
      
    </div>
  );
}