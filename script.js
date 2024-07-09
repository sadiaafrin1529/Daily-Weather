let cityInput = document.getElementById('city-input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = '5a912cc58f454e5f8f8112329240907';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeatherDetails(name, lat, lon, country) {
    let currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`;
    let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=5`;
    let airQualityUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=yes`;
    let timezoneUrl = `http://api.weatherapi.com/v1/timezone.json?key=${api_key}&q=${lat},${lon}`;
    let weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=5`;

    fetch(currentWeatherUrl)
        .then(res => res.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(() => {
            // alert('Failed to fetch current weather');
        });

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(() => {
            // alert('Failed to fetch forecast');
        });

    fetch(airQualityUrl)
        .then(res => res.json())
        .then(data => {
            displayAirQuality(data);
        })
        .catch(() => {
            // alert('Failed to fetch air quality');
        });

    fetch(timezoneUrl)
        .then(res => res.json())
        .then(data => {
            displaySunriseSunset(data);
        })
        .catch(() => {
            // alert('Failed to fetch timezone info');
        });

    fetch(weatherApiUrl)
        .then(res => res.json())
        .then(data => {
            displayWeatherDetails(data);
        })
        .catch(() => {
            // alert('Failed to fetch weather details');
        });
}

function displayCurrentWeather(data) {
    document.querySelector('.current-weather .details h2').innerText = `${data.current.temp_c}°C`;
    document.querySelector('.current-weather .details p:nth-child(3)').innerText = data.current.condition.text;
    document.querySelector('.current-weather .weather-icon img').src = data.current.condition.icon;
    document.querySelector('.card-footer p:nth-child(1)').innerText = `${days[new Date().getDay()]}, ${new Date().getDate()} ${months[new Date().getMonth()]}`;
    document.querySelector('.card-footer p:nth-child(2)').innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById('humidityVal').innerText = `${data.current.humidity}%`;
    document.getElementById('pressureVal').innerText = `${data.current.pressure_mb} hPa`;
    document.getElementById('VisibilityVal').innerText = `${data.current.vis_km} km`;
    document.getElementById('windSpeedVal').innerText = `${data.current.wind_kph} kph`;
    document.getElementById('feelsVal').innerText = `${data.current.feelslike_c}°C`;
}

function displayForecast(data) {
    let forecastHTML = '';
    data.forecast.forecastday.forEach(day => {
        forecastHTML += `
        <div class="forcast-item">
            <div class="icon-wrapper">
                <img src="${day.day.condition.icon}" alt="">
                <span>${day.day.avgtemp_c}°C</span>
            </div>
            <p>${new Date(day.date).toDateString()}</p>
            <p>${day.day.condition.text}</p>
        </div>`;
    });
    document.querySelector('.day-forcast').innerHTML = forecastHTML;
}

function displayAirQuality(data) {
    let aqi = data.current.air_quality;
    document.querySelector('.air-index').textContent = getAirQualityIndex(aqi['us-epa-index']);
    document.querySelector('.air-indices .item:nth-child(2) h2').textContent = aqi.pm2_5.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(3) h2').textContent = aqi.pm10.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(4) h2').textContent = aqi.so2.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(5) h2').textContent = aqi.co.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(6) h2').textContent = aqi.no.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(7) h2').textContent = aqi.no2.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(8) h2').textContent = aqi.nh3.toFixed(2);
    document.querySelector('.air-indices .item:nth-child(9) h2').textContent = aqi.o3.toFixed(2);
}

function getAirQualityIndex(index) {
    switch (index) {
        case 1: return 'Good';
        case 2: return 'Moderate';
        case 3: return 'Unhealthy for Sensitive Groups';
        case 4: return 'Unhealthy';
        case 5: return 'Very Unhealthy';
        case 6: return 'Hazardous';
        default: return 'Unknown';
    }
}

function displaySunriseSunset(data) {
    let sunriseTime = new Date(data.forecast.forecastday[0].astro.sunrise).toLocaleTimeString();
    let sunsetTime = new Date(data.forecast.forecastday[0].astro.sunset).toLocaleTimeString();

    document.querySelector('.highlights .card:nth-child(2) h2').innerText = sunriseTime;
    document.querySelector('.highlights .card:nth-child(2) h2:nth-child(2)').innerText = sunsetTime;
}

function displayWeatherDetails(data) {
    // Update today's highlights
    document.querySelector('.air-index').innerText = data.current.air_quality['us-epa-index'] <= 2 ? 'Good' : 'Unhealthy';

    // Update hourly forecast
    let hourlyForecastHTML = '';
    data.forecast.forecastday[0].hour.forEach(hour => {
        hourlyForecastHTML += `
        <div class="card">
            <p>${new Date(hour.time).getHours()} AM</p>
            <img src="${hour.condition.icon}" alt="">
            <p>${hour.temp_c}°C</p>
        </div>`;
    });
    document.querySelector('.hourly-forcast').innerHTML = hourlyForecastHTML;
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    let url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cityName}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let { name, lat, lon, country } = data.location;
            getWeatherDetails(name, lat, lon, country);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let { latitude, longitude } = position.coords;
            getWeatherDetails('Current Location', latitude, longitude, '');
        }, () => {
            alert('Failed to fetch current location');
        });
    } else {
        alert('Geolocation is not supported by this browser');
    }
}
function displaySunriseSunset(data) {
    document.querySelector('.sunrise-sunset .item:nth-child(1) h2').textContent = data.location.localtime_epoch;
    document.querySelector('.sunrise-sunset .item:nth-child(2) h2').textContent = data.location.localtime_epoch;
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getCurrentLocationWeather);
