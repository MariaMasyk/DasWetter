function displayCurrentDateAndTime() {
  let now = new Date();
  let options = { weekday: "long", hour: "numeric", minute: "numeric" };
  let formattedDateAndTime = now.toLocaleString("en-US", options);
  document.getElementById("currentDateTime").textContent = formattedDateAndTime;
}

// Call the function to display current date and time on page load
displayCurrentDateAndTime();

let form = document.querySelector("form");
let cityInput = document.getElementById("name");
let cityNameElement = document.getElementById("cityName");
let dayOfWeekElement = document.getElementById("dayOfWeek");
let temperatureElement = document.getElementById("temperature");
let humidityElement = document.getElementById("humidity");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let city = cityInput.value;

  // Call the function to get weather data using the provided API
  getWeatherData(city)
    .then((weatherData) => {
      // Update the corresponding weather elements with the received data
      cityNameElement.textContent = weatherData.city;
      temperatureElement.textContent = `${weatherData.temperature}°C/${weatherData.temperatureF}°F`;
      humidityElement.textContent = `Humidity ${weatherData.humidity}%`;
    })
    .catch((error) => {
      // Handle the error if weather data is not received
      cityNameElement.textContent = "Unknown";
      temperatureElement.textContent = "";
      humidityElement.textContent = "";
    });
});

// Update the day of the week and date
let now = new Date();
let options = { weekday: "long", month: "long", day: "numeric" };
let formattedDate = now.toLocaleString("en-US", options);
dayOfWeekElement.textContent = formattedDate;

// Function to get weather data using the provided API
function getWeatherData(city) {
  let apiKey = "81f3a4c3dfc04ef3a2293036230606";
  let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Check if weather data exists for the given city
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Get the necessary weather data
      let location = data.location.name;
      let temperature = data.current.temp_c;
      let temperatureF = data.current.temp_f;
      let humidity = data.current.humidity;

      return {
        city: location,
        temperature: temperature,
        temperatureF: temperatureF,
        humidity: humidity
      };
    });
}

function showWeather(response) {
  let buttonCurrent = document.querySelector("h1");
  let temperature = Math.round(response.main.temp);
  buttonCurrent.innerHTML = `in ${response.name} ${temperature}°C`;
}

function retrievePosition(position) {
  let apiKey = "771a6858bde26691dd3761c98b868a69";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showWeather(data);
    });
}

let currentButton = document.getElementById("curentButton");

currentButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(retrievePosition);
});
