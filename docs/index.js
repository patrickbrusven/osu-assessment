const OSU_DATA = {
  city: "Oregon State University",
  lat: "44.5638",
  lng: "-123.2794",
};
const EXERCISE_CONTAINER = document.getElementById("exercise-a");

const App = {
  state: {
    isLoading: true,
    error: false,
    errorMessage: null,
    errorStatus: null,
    cityData: [],
  },

  template() {
    EXERCISE_CONTAINER.innerHTML = "";
    if (this.state.isLoading) {
      EXERCISE_CONTAINER.innerHTML += `<span>loading data</span>`;
    } else if (!this.state.isLoading && this.state.error) {
      EXERCISE_CONTAINER.innerHTML += `<span>Error loading data</br>Error msg: ${this.state.errorMessage}</br>Error status: ${this.state.errorStatus}</span>`;
    } else {
      EXERCISE_CONTAINER.innerHTML += `${this.renderSelectSort()}<ol id="city-list"></ol>`;
      this.renderList(this.state.cityData);
    }
  },

  initialize() {
    this.template();
  },

  renderSelectSort() {
    return `<label for="sort">Sort by distance from OSU:</label>
      <select name="sort" id="sort">
        <option value="null">none</option>
        <option value="asc">ascending</option>
        <option value="desc">descending</option>
      </select>`;
  },

  addSelectEventListener() {
    const selectSort = document.getElementById("sort");
    selectSort.addEventListener("change", (e) => App.handleSelectChange(e));
  },

  handleSelectChange(e) {
    if (e.target.value === "asc") {
      this.renderList(
        [...this.state.cityData].sort((c1, c2) => {
          return c1.distanceToOSU - c2.distanceToOSU;
        })
      );
    } else if (e.target.value === "desc") {
      this.renderList(
        [...this.state.cityData]
          .sort((c1, c2) => {
            return c1.distanceToOSU - c2.distanceToOSU;
          })
          .reverse()
      );
    } else {
      this.renderList(this.state.cityData);
    }
  },

  renderList(data) {
    const cityList = document.getElementById("city-list");
    cityList.innerHTML = "";
    const list = data.map((data, i) => {
      return (cityList.innerHTML += `<li>City: ${data.city}<br/>Lat: ${data.lat}<br/>Lng: ${data.lng}<br/>distance to OSU: ${data.distanceToOSU}mi</li>`);
    });
  },

  handleCityData(data, statusCode) {
    if (statusCode !== 200) {
      this.state.error = true;
      this.state.errorMessage = data;
      this.state.errorStatus = statusCode;
      this.state.isLoading = false;
      this.template();
    } else {
      const serializedData = data.map((city) => {
        const distanceToOSU = distance(
          OSU_DATA.lat,
          OSU_DATA.lng,
          city.lat,
          city.lng,
          "M"
        );
        return { ...city, distanceToOSU };
      });
      serializedData.forEach((city) => {
        this.state.cityData.push(city);
      }, this);
      this.state.isLoading = false;
      this.template();
      this.addSelectEventListener();
    }
  },
};

App.initialize();

// AJAX fetch city data
const fetchCityData = new XMLHttpRequest();
fetchCityData.onreadystatechange = () => {
  if (fetchCityData.readyState === 4) {
    if (fetchCityData.status === 200) {
      const res = JSON.parse(fetchCityData.responseText);
      App.handleCityData(res, fetchCityData.status);
    } else {
      App.handleCityData(fetchCityData.statusText, fetchCityData.status);
    }
  }
};
fetchCityData.open(
  "GET",
  "https://s3-us-west-2.amazonaws.com/cdt-web-storage/cities.json",
  true
);
fetchCityData.send();
