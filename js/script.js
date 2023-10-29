//  inserte su  llave.
const openWeatherApiKey = "8b45752fa105b82bdeb13f551b12ba17";
const mapBoxApiKey = "pk.eyJ1IjoiYjIzLWplc3VzIiwiYSI6ImNsbWdrc21wMTJzcWszZG81MGwzcXV3Z3YifQ.7458Cg5oTOv-hbWJyoZByw";
const ticketmasterApiKey = "ByUsgRwoS2yo6Y9GbMjQjOXqEH7a1rgm";

document
  .querySelector("#town-search-button")
  .addEventListener("click", function () {
    console.log("clicked");
    const searchText = document.querySelector("#town-search-field").value;
    document.querySelector(".town-info").innerHTML = "";
    document.querySelector(".town-events").innerHTML = "";

    searchTown(searchText);
  });

function searchTown(townName) {
  let data = fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      townName +
      "&limit=5&appid=" +
      openWeatherApiKey
  )
    .then((response) => response.json())
    .then((data) => {
      const name = data[0].name;
      const country = data[0].country;
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log(name + ", " + country);

      //   console.log(data);
      getWeather(lat, lon, name + ", " + country);
      getMapImage(lat, lon, name);
      getTownEvents(name);
    })
    .catch((error) => console.log(error));

  console.log(data.lat);
}

function getMapImage(lat, lon, townName) {
  fetch(
    "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/" +
      lon +
      "," +
      lat +
      ",12,0/400x200?access_token=" +
      mapBoxApiKey
  )
    .then((response) => response.url)
    .then((data) => {
      let img = document.createElement("img");
      img.setAttribute("src", data);
      img.setAttribute("alt", "Map of " + townName);
      document.querySelector(".town-info").appendChild(img);
    })
    .catch((error) => console.log(error));
}

function getWeather(lat, lon, townName) {
  return fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&appid=" +
      openWeatherApiKey
  )
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".town-info").classList.add("group-border");

      const temp = data.main.temp;
      const feelsLike = data.main.feels_like;
      const description = data.weather[0].main;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      console.log(temp, feelsLike, description, windSpeed, humidity);
      let div = document.createElement("div");
      div.innerHTML = `
        <h2>${townName}</h2>
        <p><strong>${description}</strong></p>
        <p>${temp}°C (feels like ${feelsLike}°C)</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind speed: ${windSpeed} m/s</p>
        `;

      const parent = document.querySelector(".town-info");
      let firstChild = parent.firstChild;
      parent.insertBefore(div, firstChild);
    })
    .catch((error) => console.log(error));
}

function getTownEvents(townName) {
  const request =
    "https://app.ticketmaster.com/discovery/v2/events?city=" +
    townName +
    "&radius=25&apikey=" +
    ticketmasterApiKey;
  console.log(request);
  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      if (data._embedded.events) {
        document.querySelector(".town-events").classList.add("group-border");
        const table = document.createElement("table");
        const tbody = document.createElement("tbody");
        document.querySelector(".town-events").appendChild(table);
        table.appendChild(tbody);
        console.log(data);
        data._embedded.events.forEach((event) => {
          console.log(event);
          let row = document.createElement("tr");

          let cell = document.createElement("td");
          cell.classList.add("event-text");
          cell.innerHTML = `
        <p>${event.name}</p>
        <p>${event.dates.start.localDate} ${event.dates.start.localTime}, ${event._embedded.venues[0].name} - ${event._embedded.venues[0].city.name}</p>
        `;
          row.appendChild(cell);
          tbody.appendChild(row);
        });
      } else {
        throw new Error("No events found");
      }
    })
    .catch((error) => console.log(error));
}
