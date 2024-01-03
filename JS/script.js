var apiKey = 'd3f199f65c0305f9e92719a9dc0c2c46';
var weatherURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial`;
var forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=atlanta&appid=${apiKey}&units=imperial`;
var citySearch = $('#city-search');
var searchBtn = $('#search');
var cityName = citySearch.val()
var cityBtn = $('<button>').text(cityName);




// Pull the weather data for the city that was searched by the user. Cross ref with previous searches to either pull up old search or add new search to localStorage
function getCurrentWeather() {
    var cityName = citySearch.val()
    var history = getHistory();

    if (!history.includes(cityName)) {
        // Add city to the history array
        history.push(cityName);
        // Replace old history array in localStorage with the new array
        localStorage.setItem('search-history', JSON.stringify(history));
    }
    $.get(weatherURL + `&q=${cityName}`)
        .then(function (weatherData) {
            // Clear Previous inputs
            $('#city-name').empty();
            $('#temperature').empty();
            $('#humidity').empty();
            $('#wind-speed').empty();
            
            // Output the current weather conditions
            var temp = weatherData.main.temp;
            var humid = weatherData.main.humidity;
            var wind = weatherData.wind.speed;

            // Add need html elements
            $('#city-name').text(cityName)
            $('#temperature').text(temp + ' °F');
            $('#humidity').text(humid + '%');
            $('#wind-speed').text(wind + 'mph');

        })
        // Retrieve forcast weather
        .then(function(){
            getForcast(cityName);
            showHistory();
        });
}

// Get history to check which cities have already been searched and logged.
function getHistory() {
    var rawData = localStorage.getItem('search-history');
    var history = JSON.parse(rawData) || [];

    return history;
}

// Create function to grab the forecast data
function getForcast() {
var cityName = citySearch.val()

    $.get(forcastURL + `&q=${cityName}`)
        .then(function (forecastData) {

            var blocks = forecastData.list;

            for (var i = 0; i < blocks.length; i++) {
                var blockObj = blocks[i];
                // Only work with noon time blocks
                if (blockObj.dt_txt.includes('12:00')) {
                    var forecastDate = new Date(blockObj.dt * 1000).toLocaleDateString();
                    var forecastTemp = blockObj.main.temp;
                    var forecastHumid = blockObj.main.humidity;
                    var forecastWind = blockObj.wind.speed;

            // Create HTML Elements
            var forecastBlock = `
            <div class="forecast-item">
              <h4>${forecastDate}</h4>
              <p>Temperature: ${forecastTemp} °F</p>
              <p>Humidity: ${forecastHumid}%</p>
              <p>Wind Speed: ${forecastWind}mph</p>
            </div>
          `;

            $('#forecast-data').append(forecastBlock);
                }
            }
        })
}

// Create function to show the cities that have already been searched as buttons that can be ref on the site
function showHistory() {
    var history = getHistory();
    var historyContainer = $('#history-container');

    historyContainer.empty();

    history.forEach(function(cityName){
    var cityBtn = $('<button>').text(cityName);
    historyContainer.append(cityBtn);
    });
}

searchBtn.on('click', getCurrentWeather);
// cityBtn.on('click', getCurrentWeather);