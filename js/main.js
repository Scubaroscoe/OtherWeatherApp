const button = document.querySelector('button');
const form = document.querySelector('form');
// const searchDiv = document.querySelector('#search-div');

async function fetchData() {
  let location, tempUnit;
  const searchInput = document.querySelector('#search-in');
  location = searchInput.value || 'Hartford';

  const fRB = document.querySelector('#fRB');
  const cRB = document.querySelector('#cRB');
  tempUnit = fRB.checked ? 'F' : 'C';

  const base = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const API = '&APPID=6ab377c27897f097f2f1501d2b3182ad';
  const units = tempUnit === 'F' ? '&units=imperial' : '&units=metric';
  const request = base + location + API + units;
  let mainweather;
  try {
    const response = await fetch(request, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${api_key}&s=${subject}`, { mode: 'cors' });
    // console.log(`response: ${response}`);
    const data = await response.json();
    // console.log(`data: ${data}`);
    mainweather = harvestData(data, tempUnit);
    console.log(`mainweather is: ${mainweather}`);
  } catch(error) {
    console.log('There has been a problem with the fetch operation: ' + error.message);
  }
  return mainweather;
}

function setupP(str, data, unit = '') {
  let element = document.createElement('p');
  element.textContent = str + data + unit;
  return element;
}

// To get the relevant final times, we need to apply GMT values to the time 
function extractGMT(date) {
  console.log(`Date is: ${date}`);
  // We want the part that comes right after GMT-
  let test = date.toString().split("GMT-");
  // Second array element contains the gmt value. Will always be first 4 chars
  let gmt = test[1].slice(0, 4);
  console.log(`gmt is: ${gmt}`);
  // Want the first 2 numbers as I don't think time zones will ever be half way (30 min)
  let retVal = Number(gmt.slice(0, 2));
  console.log(retVal);
  return retVal
}

function calculateTime(time, timezone, text) {
  let p = document.createElement('p');
  let date = new Date((time + timezone) * 1000);
  let gmt = extractGMT(date);
  let hours = date.getHours() + gmt;
  
  let ending;
  if (hours < 13) {
    ending = ' A.M.';
  } else {
    ending = ' P.M.';
    hours = hours % 12;
  }

  let min = date.getMinutes().toString().length < 2 ? '0' + date.getMinutes() : date.getMinutes();
  let formattedTime = hours + ':' + min;
  p.textContent = text + formattedTime + ending;
  
  return p;
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
  const timezone = data.timezone; // shift in seconds from utc.
  const windSpeed = data.wind.speed; // default m/s, metric meter/sec, imperial miles/hour
  const windDir = data.wind.deg; // degrees (meteorological)

  

  const loch2 = document.createElement('h2');
  loch2.textContent = 'Location: ' + loc;

  const weatherMainP = setupP('Main: ', weatherMain);
  const weatherP = setupP('Description: ', weatherDescription + ': ' + cloudiness, '%');
  const tempP = setupP('Temperature: ', temp, units);
  const tempMinP = setupP('Minimum Temperature: ', tempMin, units);
  const tempMaxP = setupP('Maximum Temperature: ', tempMax, units);
  const feelsLikeP = setupP('Feels like: ', feelsLike, units);
  const pressureP = setupP('Pressure: ' + pressure, 'hPa');
  const humidityP = setupP('Humidity: ', humidity, '%');
  const visibilityP = setupP('Visibility: ' + visibility, 'm');
  const directionP = setupP('Wind Direction: ', windDir, ' degrees')

  let speedP;
  if (units === 'F') {
    speedP = setupP('Wind Speed: ', windSpeed, 'mph');
  } else {
    speedP = setupP('Wind Speed: ', windSpeed, 'm/s');
  }

  const sunriseP = calculateTime(sunriseTime, timezone, 'Sunrise Time: ');  // should be 7:30ish
  const sunsetP = calculateTime(sunsetTime, timezone, 'Sunset Time: '); // should be 6:07p.m. ish

  weatherDiv.append(loch2, weatherMainP, weatherP, tempP, tempMinP, tempMaxP, feelsLikeP
    , pressureP, humidityP, visibilityP, sunriseP, sunsetP, speedP, directionP);
  return weatherMain;
}


async function fetchGif(mainweather) {
  const weatherDiv = document.querySelector('#weather-div')
  // console.log(mainP.textContent);

  let subject = await mainweather.then(function (result) {
    return result;
  });
  const api_key = 'igAuI2gTFros5rTskOx6qqEEWGc5eGPV';
  const img = document.createElement('img');
  try {
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=${api_key}&s=${subject}`
    console.log(`response url is: ${url}`)
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${api_key}&s=${subject}`, { mode: 'cors' });
    const gifData = await response.json();
    img.src = gifData.data.images.original.url;
  } catch(err) {		
    img.src = '../error.gif';
  }
  // weatherDiv.prependChild(img);
  weatherDiv.prepend(img);
}
// button.addEventListener('click', fetchData);
form.addEventListener('submit', function (event) {
  event.preventDefault(); // This is absolutely necessary. Form's apparently can't really handle asynchronous requests
  // for this reason you need to use the above before using an asynchronous function
  let mainweather = fetchData();
  fetchGif(mainweather);
});
  // fetchData);