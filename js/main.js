const button = document.querySelector('button');
// const searchDiv = document.querySelector('#search-div');

async function fetchData(e) {
  let location, tempUnit;
  const searchInput = document.querySelector('#search-in');
  location = searchInput.value || 'London';

  const fRB = document.querySelector('#fRB');
  const cRB = document.querySelector('#cRB');
  tempUnit = fRB.checked ? 'F' : 'C';

  const base = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const API = '&APPID=6ab377c27897f097f2f1501d2b3182ad';
  const units = tempUnit === 'F' ? '&units=imperial' : '&units=metric';
  const request = base + location + API + units;
  
  try {
    const response = await fetch(request, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${api_key}&s=${subject}`, { mode: 'cors' });
    // console.log(`response: ${response}`);
    const data = await response.json();
    // console.log(`data: ${data}`);
    harvestData(data, tempUnit);    
  } catch(e) {
    console.log('There has been a problem with the fetch operation: ' + e.message);
  }
  // console.log(data);
  // return data;
  // const response = await fetch(request, { mode: 'cors' });
  // console.log("after the try/catch");
}

function harvestData(data, units) {
  const weatherDiv = document.querySelector('#weather-div');

  // reset div if necessary
  while (weatherDiv.firstChild) {
    weatherDiv.removeChild(weatherDiv.lastChild);
  }

  const loc = data.name;
  const weatherDescription = data.weather[0].description; // overcast cloudy
  const weatherMain = data.weather[0].main; // clouds
  const cloudiness = data.clouds.all; // cloudiness %
  const temp = data.main.temp;  //286.33 looks like kelvin by default
  const tempMin = data.main.temp_min;
  const tempMax = data.main.temp_max;
  const pressure = data.main.pressure; // if there's no sea_level, this is default sea_level
  // Above in hPa
  const humidity = data.main.humidity;  // %
  const feelsLike = data.main.feels_like;
  const visibility = data.visibility;  // 10000 meters
  const sunriseTime = data.sys.sunrise; //1634279064 unix utC
  const sunsetTime = data.sys.sunset; // 163417667
  const timezone = data.timezone; // shift in seconds from utc
  const windSpeed = data.wind.speed; // default m/s, metric meter/sec, imperial miles/hour
  const windDir = data.wind.deg; // degrees (meteorological)

  
  const loch2 = document.createElement('h2');
  loch2.textContent = 'Location: ' + loc;

  const weatherMainP = document.createElement('p');
  weatherMainP.textContent = 'Main: ' + weatherMain;

  const weatherP = document.createElement('p');
  weatherP.textContent = 'Description: ' + weatherDescription + ': ' + cloudiness + '%';

  const tempP = document.createElement('p');
  tempP.textContent = 'Temperature: ' + temp + units;
  
  const tempMinP = document.createElement('p');
  tempMinP.textContent = 'Minimum Temperature: ' + tempMin + units;

  const tempMaxP = document.createElement('p');
  tempMaxP.textContent = 'Maximum Temperature: ' + tempMax + units;

  const feelsLikeP = document.createElement('p');
  feelsLikeP.textContent = 'Feels like: ' + feelsLike + units;

  const pressureP = document.createElement('p');
  pressureP.textContent = 'Pressure: ' + pressure + 'hPa';

  const humidityP = document.createElement('p');
  humidityP.textContent = 'Humidity: ' + humidity + '%';
  
  const visibilityP = document.createElement('p');
  visibilityP.textContent = 'Visibility: ' + visibility + 'm';


  const sunriseP = document.createElement('p');
  let sunriseDate = new Date((sunriseTime-timezone) * 1000);
  let sunHours = sunriseDate.getHours();
  let sunMin = sunriseDate.getMinutes().length < 2 ? '0' + sunriseDate.getMinutes() : sunriseDate.getMinutes();
  let sunriseFormatted = sunHours + ':' + sunMin;
  sunriseP.textContent = 'Sunrise Time: ' + sunriseFormatted; // should be 7:25a.m.

  const sunsetP = document.createElement('p');
  let sunsetDate = new Date(sunsetTime * 1000);
  let sunsetHours = sunsetDate.getHours();
  let sunsetMin = sunsetDate.getMinutes().length < 2 ? '0' + sunsetDate.getMinutes() : sunsetDate.getMinutes();
  let sunsetFormatted = sunsetHours + ':' + sunsetMin;
  sunsetP.textContent = 'Sunset Time: ' + sunsetFormatted;  // should be 6:07p.m.

  const speedP = document.createElement('p');
  if (units === 'F') {
    speedP.textContent = 'Wind Speed: ' + windSpeed + 'mph';
  } else {
    speedP.textContent = 'Wind Speed: ' + windSpeed + 'm/s';
  }

  const directionP = document.createElement('p');
  directionP.textContent = 'Wind Direction: ' + windDir + ' degrees';

  weatherDiv.append(loch2, weatherMainP, weatherP, tempP, tempMinP, tempMaxP, feelsLikeP
    , pressureP, humidityP, visibilityP, sunriseP, sunsetP, speedP, directionP);
}

// determine if using metric or imperial

button.addEventListener('click', fetchData);