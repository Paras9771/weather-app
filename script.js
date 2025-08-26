// === Step 1: Select DOM Elements ===
let weatherCity = document.querySelector('.weather-city');
let errormessage = document.querySelector('.error-message');
let weatherDateTime = document.querySelector('.weather-date-time');
let weatherForecast = document.querySelector('.weather-forecast');
let weatherIcon = document.querySelector('.weather-icon');
let weatherTemperature = document.querySelector('.weather-temperature');
let weatherMin = document.querySelector('.weather-min');
let weatherMax = document.querySelector('.weather-max');
let weatherFeelsLike = document.querySelector('.weather-feels-like');
let weatherHumidity = document.querySelector('.weather-humidity');
let weatherWind = document.querySelector('.weather-wind');
let weatherPressure = document.querySelector('.weather-pressure');
let weathersunrise = document.querySelector('.weather-sunrise');
let weathersunset = document.querySelector('.weather-sunset');
let citynamesearch = document.querySelector('.weather-search');

// === Helper: Clear all weather data from UI ===
function clearWeatherUI() {
    weatherCity.innerHTML = "";
    weatherDateTime.innerHTML = "";
    weatherForecast.innerHTML = "";
    weatherIcon.innerHTML = "";
    weatherTemperature.innerHTML = "";
    weatherMin.innerHTML = "";
    weatherMax.innerHTML = "";
    weatherFeelsLike.innerHTML = "";
    weatherHumidity.innerHTML = "";
    weatherWind.innerHTML = "";
    weatherPressure.innerHTML = "";
    weathersunrise.innerHTML = "";
    weathersunset.innerHTML = "";
}

// === Helper: Convert country code to country name ===
const getCountryName = (code) => {
    let regionName = new Intl.DisplayNames(['en'], { type: "region" });
    return regionName.of(code);
};

// === Helper: Format full date and time from timestamp ===
const getDateAndTime = (dt) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12:true,
    };
    const date = new Date(dt * 1000);
    return new Intl.DateTimeFormat("en-US", options).format(date);
};

// === Helper: Format only time (for sunrise & sunset) ===
const getTime = (dt) => {
    const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    const date = new Date(dt * 1000);
    return new Intl.DateTimeFormat("en-US", options).format(date);
};

// === Default City on page load ===
let searchcity = "Noida";

// === Handle City Search Form Submission ===
citynamesearch.addEventListener('submit', (e) => {
    e.preventDefault();

    let cityname = document.querySelector('.city-name');
    searchcity = cityname.value.trim();

    if (searchcity !== "") {
        getWeatherData();
    }

    cityname.value = ""; 
});

// === Helper: Change background color based on weather condition ===
function setWeatherBackground(condition) {
    let body = document.body;
    body.classList.remove("sunny", "rainy", "cloudy", "night");

    if (condition === "Clear") {
        body.classList.add("sunny");
    } else if (
        condition === "Rain" ||
        condition === "Drizzle" ||
        condition === "Thunderstorm"
    ) {
        body.classList.add("rainy");
    } else if (condition === "Clouds") {
        body.classList.add("cloudy");
    } else {
        body.classList.add("night"); // fallback
    }
}

// === Step 2: Fetch weather data from API ===
const getWeatherData = async () => {
    try {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchcity}&appid=337198e8f8eb425b18d8e1833f5d9caf&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // --- Error handling ---
        if (data.cod != 200) {
            clearWeatherUI();
            errormessage.style.display = "block";
            errormessage.innerText = "City not found, try again!";
            return; 
        }
        errormessage.style.display = "none";

        const { main, name, weather, wind, sys, dt } = data;

        weatherCity.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        weatherDateTime.innerHTML = getDateAndTime(dt);
        weatherForecast.innerHTML = weather[0].main;

        // Set background (detect night from icon)
        if (weather[0].icon.includes("n")) {
            setWeatherBackground("Night");
        } else {
            setWeatherBackground(weather[0].main);
        }

        weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="Weather Icon">`;

        weatherTemperature.innerHTML = `${main.temp.toFixed()}&#176; C`;
        weatherMin.innerHTML = `Min: ${main.temp_min.toFixed()}&#176; C`;
        weatherMax.innerHTML = `Max: ${main.temp_max.toFixed()}&#176; C`;

        weatherFeelsLike.innerHTML = `${main.feels_like.toFixed()}&#176; C`;
        weatherHumidity.innerHTML = `${main.humidity}%`;
        weatherWind.innerHTML = `${wind.speed} m/s`;
        weatherPressure.innerHTML = `${main.pressure} hPa`;
        weathersunrise.innerHTML = `${getTime(sys.sunrise)}`;
        weathersunset.innerHTML = `${getTime(sys.sunset)}`;

    } catch (error) {
        clearWeatherUI();
        console.log("Error fetching weather data:", error);
        errormessage.style.display = "block";
        errormessage.innerText = "Something went wrong. Please try again!";
    }
};

// === Load default weather data on page load ===
window.addEventListener('load', getWeatherData);
