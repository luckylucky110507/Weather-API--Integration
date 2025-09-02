const weatherApiKey = "bd0253eb16f2c1a3e10d87ce06e36309"; 

const weatherBtn = document.getElementById("getWeatherBtn");
const weatherResult = document.getElementById("weatherResult");
const darkModeToggle = document.getElementById("darkModeToggle"); 

function setWeatherBackground(condition) {
    document.body.classList.remove("default-bg", "sunny-bg", "cloudy-bg", "rainy-bg", "snowy-bg", "night-bg");

    if (condition.includes("cloud")) {
        document.body.classList.add("cloudy-bg");
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        document.body.classList.add("rainy-bg");
    } else if (condition.includes("snow")) {
        document.body.classList.add("snowy-bg");
    } else if (condition.includes("clear")) {
        const hours = new Date().getHours();
        if (hours >= 18 || hours < 6) {
            document.body.classList.add("night-bg");
        } else {
            document.body.classList.add("sunny-bg");
        }
    } else {
        document.body.classList.add("default-bg"); 
    }
}

weatherBtn.addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`; // fixed "apid" -> "appid"

    fetch(weatherUrl)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherResult.innerHTML = `<p>City not found</p>`; 
                setWeatherBackground("default");
                return;
            }

            let iconClass = "fa-sun";
            let condition = data.weather[0].main.toLowerCase();

            if (condition.includes("cloud")) {
                iconClass = "fa-cloud";
            } else if (condition.includes("rain")) {
                iconClass = "fa-cloud-showers-heavy";
            } else if (condition.includes("snow")) {
                iconClass = "fa-snowflake";
            } else if (condition.includes("clear")) {
                iconClass = "fa-sun";
            }

            const weatherHTML = `
                <i class="fas ${iconClass} weather-icon"></i>
                <h3>${data.name}, ${data.sys.country}</h3>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${data.wind.speed} m/s</p>
            `;
            weatherResult.innerHTML = weatherHTML;

            setWeatherBackground(condition);
        })
        .catch(err => {
            weatherResult.innerHTML = `<p>Error fetching data</p>`;
            console.error(err);
            setWeatherBackground("default");
        });
});

darkModeToggle.addEventListener("click", () => { 
    document.body.classList.toggle("dark");

    const icon = darkModeToggle.querySelector("i");
    if (document.body.classList.contains("dark")) { 
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});
