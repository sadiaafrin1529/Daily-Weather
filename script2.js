let cityInput = document.getElementById('city-input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = '5a912cc58f454e5f8f8112329240907';

function getWeatherDetails(name, lat, lon, country, tz_id) {
    let currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`;
    let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=5`;
    let airQualityUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=yes`;
    let timezoneUrl = `http://api.weatherapi.com/v1/timezone.json?key=${api_key}&q=${lat},${lon}`;

    fetch(currentWeatherUrl)
        .then(res => res.json())
        .then(data => {
            console.log('Current Weather:', data);
            displayCurrentWeather(data);
        })
        .catch(() => {
            alert('Failed to fetch current weather');
        });

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            console.log('Forecast:', data);
            displayForecast(data);
        })
        .catch(() => {
            alert('Failed to fetch forecast');
        });

    fetch(airQualityUrl)
        .then(res => res.json())
        .then(data => {
            console.log('Air Quality:', data);
            displayAirQuality(data);
        })
        .catch(() => {
            alert('Failed to fetch air quality');
        });

    fetch(timezoneUrl)
        .then(res => res.json())
        .then(data => {
            console.log('Timezone:', data);
            displaySunriseSunset(data);
        })
        .catch(() => {
            alert('Failed to fetch timezone info');
        });
}

function displayCurrentWeather(data) {
    document.querySelector('.current-weather h2').innerHTML = `${data.current.temp_c}&deg;C`;
    document.querySelector('.current-weather .details p:nth-child(3)').textContent = data.current.condition.text;
    document.querySelector('.current-weather .details p:nth-child(4)').textContent = `Humidity: ${data.current.humidity}%`;
    document.querySelector('.weather-icon img').src = data.current.condition.icon;
    document.querySelector('.card-footer p:nth-child(1)').innerHTML = `<i class="fa-solid fa-calendar"></i> ${data.location.localtime}`;
    document.querySelector('.card-footer p:nth-child(2)').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location.name}, ${data.location.country}`;
}

function displayForecast(data) {
    let forecastItems = document.querySelectorAll('.forcast-item');
    data.forecast.forecastday.forEach((day, index) => {
        if (forecastItems[index]) {
            forecastItems[index].querySelector('.icon-wrapper img').src = day.day.condition.icon;
            forecastItems[index].querySelector('.icon-wrapper span').innerHTML = `${day.day.avgtemp_c}&deg;C`;
            forecastItems[index].querySelector('p:nth-child(2)').textContent = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
            forecastItems[index].querySelector('p:nth-child(3)').textContent = day.day.condition.text;
        }
    });
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
    document.querySelector('.sunrise-sunset .item:nth-child(1) h2').textContent = data.location.localtime_epoch;
    document.querySelector('.sunrise-sunset .item:nth-child(2) h2').textContent = data.location.localtime_epoch;
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    let url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cityName}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let { name, lat, lon, country, tz_id } = data.location;
            getWeatherDetails(name, lat, lon, country, tz_id);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

searchBtn.addEventListener('click', getCityCoordinates);

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            getWeatherDetails('Current Location', lat, lon, '', '');
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

locationBtn.addEventListener('click', getCurrentLocationWeather);
