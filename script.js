const link =
  //   "http://api.weatherstack.com/current?access_key=2bd85aa00bc58ebdba4f243df555077b";
  `http://api.weatherapi.com/v1/current.json?key=76a7eb903d4945a9bee155458230704`;

const root = document.getElementById("root");

const popup = document.getElementById('popup')

const textInput = document.getElementById('text-input')

const form = document.getElementById('form')

const popupClose = document.getElementById('close')

let store = {
  city: "Kazan",
  feelslike: 0,
  temperature: 0,

  observationTime: "00:00 AM",

  isDay: "yes",
  description: "",

  properties: {
    cloudcover: 0,
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
    visibility: 0,
    pressure: 0,
  },
};

const fetchData = async () => {

  // const query = localStorage.getItem('query') || store.city
  const result = await fetch(`${link}&query=${store.city}`);
  const data = await result.json();

  console.log(data);

  const {
    current: {
      humidity,
      vis_km: visibility,
      feelslike_c: feelslike,
      cloud: cloudcover,
      temp_c: temperature,
      last_updated: observationTime,
      pressure_in: pressure,
      uv: uvIndex,
      is_day: isDay,
      condition: description,
      wind_kph: windSpeed,
    },
    location: { name },
  } = data;

  store = {


    ...store,

    feelslike,

    temperature,

    observationTime,

    isDay,
    description: Object.values(description)[0],
    properties: {
      cloudcover: {
        title: 'cloudcover',
        value: `${cloudcover}%`,
        icon: "cloud.png",
      },
      humidity: {
        title: 'humidity',
        value: `${humidity}%`,
        icon: "humidity.png",
      },

      windSpeed: { 
        title: 'wind speed',
        value: `${windSpeed}km/h`, 
      icon: "wind.png" },

      uvIndex: { 
        title: 'uv-index',
        value: `${uvIndex}/100`, 
      icon: "uv-index.png" },

      visibility: {
        title: 'visibility',
        value:`${visibility}%`,
      icon: "visibility.png"},

      pressure: {
        title: 'pressure',
        value:`${pressure}%`,
      icon: "gauge.png"},
    },
  };

  renderComponent();
  
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case "clear":
      return "../img/the.png";
    case "sunny":
      return "../img/sunny.png";
    case "partly cloudy":
      return "../img/cloud.png";
    case "mist":
      return "../img/fog.png";
    case "cloud":
      return "../img/cloud.png";
    default:
      return "../img/the.png";
  }
};

const renderProperty = (properties) => {
  console.log(properties);
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markUp = (store) => {
  const { city, description, observationTime, temperature, isDay, properties } =
    store;

  const containerClass = isDay == `1` ? "is-day" : "";

  return `<div class="container ${containerClass}">
    <div class="top">
      <div class="city">
        <div class="city-subtitle">Weather Today in</div>
          <div class="city-title" id="city">
          <span>${city}</span>
        </div>
      </div>
      <div class="city-info">
        <div class="top-left">
        <img class="icon" src="./img/${getImage(description)}" alt="" />
        <div class="description">${description}</div>
      </div>
    
      <div class="top-right">
        <div class="city-info__subtitle">as of ${observationTime}</div>
        <div class="city-info__title">${temperature}°</div>
      </div>
    </div>
  </div>
<div id="properties">${renderProperty(properties)}</div>
</div>`;
};

const renderComponent = () => {
  root.innerHTML = markUp(store);
  const city = document.getElementById('city')
  city.addEventListener('click', handleClick)
};

const handleClick = () =>{
  popup.classList.toggle('active')
}

const hundleInput = (e) =>{
  store ={
    ...store,
    city: e.target.value
  }
}

const handleSubmit = (e)=>{
  e.preventDefault()

  const value = store.city

  // localStorage.setItem('query', value)

  fetchData()
  handleClick()
}

const closePopup = () =>{
  handleClick()
}

popupClose.addEventListener('click', closePopup)

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', hundleInput)



fetchData();
