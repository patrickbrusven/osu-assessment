// Oregon State University Coordinates.
const OSU_LAT_LNG = {
  lat: "44.5638",
  lng: "-123.2794",
};

// Entry to index.html.
const EXERCISE_CONTAINER = document.getElementById("exercise-a");

// Object literal containing all logic for Excercise A.
const App = {
  state: {
    isLoading: true,
    isError: false,
    errorMessage: null,
    errorStatus: null,
    cityData: [],
  },

  template() {
    EXERCISE_CONTAINER.innerHTML = "";
    if (this.state.isLoading) {
      EXERCISE_CONTAINER.innerHTML += `<span>loading data</span>`;
    } else if (!this.state.isLoading && this.state.isError) {
      EXERCISE_CONTAINER.innerHTML += `<span>Error loading data</br>Error msg: ${this.state.errorMessage}</br>Error status: ${this.state.errorStatus}</span>`;
    } else {
      EXERCISE_CONTAINER.innerHTML += `${this.renderSelectSort()}<ol id="city-list"></ol>`;
      this.renderList(this.state.cityData);
    }
  },

  initialize() {
    this.template();
    this.fetchCityData();
  },

  renderSelectSort() {
    return `<label for="sort">Sort by distance to OSU:</label>
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
    const list = data.map((data) => {
      return (cityList.innerHTML += `<li>City: ${data.city}<br/>Lat: ${data.lat}<br/>Lng: ${data.lng}<br/>distance to OSU: ${data.distanceToOSU}mi</li>`);
    });
  },

  handleCityData(data) {
    const serializedData = data.map((city) => {
      const distanceToOSU = distance(
        OSU_LAT_LNG.lat,
        OSU_LAT_LNG.lng,
        city.lat,
        city.lng,
        "M"
      ).toFixed(2);
      return { ...city, distanceToOSU };
    });
    serializedData.forEach((city) => {
      this.state.cityData.push(city);
    }, this);
    this.state.isLoading = false;
    this.template();
    this.addSelectEventListener();
  },

  fetchCityData() {
    fetch("https://s3-us-west-2.amazonaws.com/cdt-web-storage/cities.json")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((data) => {
        this.handleCityData(data);
      })
      .catch((e) => {
        this.state.isError = true;
        this.state.errorMessage = e.statusText;
        this.state.errorStatus = e.status;
        this.state.isLoading = false;
        this.template();
      });
  },
};

App.initialize();
