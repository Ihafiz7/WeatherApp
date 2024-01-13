import React from 'react'

const Conversion = ({weatherData}) => {
    const [sunrise, setSunrise] = React.useState(null);
    const [sunset, setSunset] = React.useState(null);
    const [sunUpTime, setSunUpTime] = React.useState(null);
    const [timezone, setTimezone] = React.useState(null);
    const [direction, setDirection] = React.useState(null);
  
    React.useEffect(() => {
      if (weatherData) {
        const sunriseTime = unixTimeToCurrentTime(weatherData.sys.sunrise, weatherData.timezone);
        setSunrise(sunriseTime);
  
        const sunsetTime = unixTimeToCurrentTime(weatherData.sys.sunset,weatherData.timezone);
        setSunset(sunsetTime);
  
        const timezoneOffset = timezoneInHours(weatherData.timezone);
        setTimezone(timezoneOffset);
  
        const windDirection = degreesToDirection(weatherData.wind.deg);
        setDirection(windDirection);
      }
    }, [weatherData]);


  
    function timezoneInHours (seconds) {
       return seconds / 3600;
      
    }
  
    function unixTimeToCurrentTime(unixTimestamp , timezoneValue) {
      const unixTimestampMilliseconds = ((unixTimestamp + timezoneValue) * 1000);
      const date = new Date(unixTimestampMilliseconds);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const currentTime = `${formattedHours}:${minutes}:${seconds} ${period}`;
      return currentTime;
    }
  
  
    function degreesToDirection(degrees) {
      // Define directional sectors and degree ranges
      const directions = ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'];

      const degreeRanges = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
    
      // Adjust degrees to be within the range [0, 360)
      const adjustedDegrees = (degrees + 360) % 360;
    
      // Determine the direction based on degree ranges
      for (let i = 0; i < directions.length; i++) {
        if (adjustedDegrees < degreeRanges[i]) {
          return directions[i];
        }
      }
    
      // If the degrees are near 360, consider it as North (N)
      return 'N';
    }

    React.useEffect(() => {
      if(sunrise && sunset){
        function timeToSeconds(timeString) {
          const [time, period] = timeString.split(' ');
          const [hours, minutes, seconds] = time.split(':').map(Number);
        
          let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
          if (period === 'PM' && hours !== 12) {
            totalSeconds += 12 * 3600; // add 12 hours for PM (except for 12 PM)
          } else if (period === 'AM' && hours === 12) {
            totalSeconds -= 12 * 3600; // subtract 12 hours for 12 AM
          }
        
          return totalSeconds;
        }
    
        function secondsToTimeFormat(seconds) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = seconds % 60;
        
          return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }
    
        function findTimeDifference(startTime, endTime) {
          const startSeconds = timeToSeconds(startTime);
          const endSeconds = timeToSeconds(endTime);
        
          let timeDifference = endSeconds - startSeconds;
        
          if (timeDifference < 0) {
            timeDifference += 24 * 3600; // add a day if end time is before start time
          }
        
          return secondsToTimeFormat(timeDifference);
        }
        const startTime = sunrise;
        const endTime = sunset;
    
        const timeDifferenceFormatted = findTimeDifference(startTime, endTime);
        
        setSunUpTime(timeDifferenceFormatted);
      }
    }, [sunrise,sunset]);

    
  
    
  
    return (
      <div className='con'>
        <div className='con-main'>
          {sunrise && (
            <div className="con-div"> 
              <span>Sunrise(Local Time)</span>
              <p>{sunrise}</p> 
            </div>
          )}
          {sunset && (
            <div className="con-div">
              <span>Sunset(Local Time)</span>
              <p>{sunset}</p>
            </div>
          )}
        </div>
        <div className='con-main'>
          {sunUpTime && (
          <div className='con-div'>
            <span>Total Sun Time</span>
            <p>{sunUpTime} h</p>
          </div>
          )}
        </div>
        <div className='con-main'>
          {timezone && (
            <div className="con-div">
              <span>Timezone</span>
              <p>GMT {(timezone > 0 ? `+ ${timezone}` : timezone)} Hours</p>
            </div>
          )}
          {direction && (
            <div className="con-div">
              <span>Wind Direction</span>
              <p> Towards {direction}({weatherData.wind.deg}°)</p>             
            </div>
          )}
        </div>
      </div>
    );
}

export default Conversion