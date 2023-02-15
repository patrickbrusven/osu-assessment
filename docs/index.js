const OSU = {
  city: "Oregon State University",
  lat: "44.5638",
  lng: "-123.2794",
};
const exerciseContainer = document.getElementById("exercise-a");
const selectSort = document.getElementById("sort");
const loadingState = document.getElementById("loading");

selectSort.addEventListener("change", handleSelectChange);

const App = {
  state: {
    isLoading: true,
    error: false,
    errorMessage: null,
    errorStatus: null,
    cityData: [],
  },
  template() {
    exerciseContainer.innerHTML = "";
    let renderThis = null;
    if (this.state.isLoading) {
      renderThis = `<span>loading data</span>`;
    } else if (!this.state.isLoading && this.state.error) {
      renderThis = `<span>Error loading data</br>Error msg: ${this.state.errorMessage}</br>Error status: ${this.state.errorStatus}</span>`;
    } else {
      renderThis = this.renderList(this.state.cityData);
    }
    exerciseContainer.innerHTML = renderThis;
  },
  initialize() {
    this.template();
  },

  renderList(data) {
    exerciseContainer.innerHTML = "";
    data.map((data, i) => {
      return (exerciseContainer.innerHTML += `<li>City: ${data.city}<br/>Lat: ${data.lat}<br/>Lng: ${data.lng}<br/>distance to OSU: ${data.distanceToOSU}mi</li>`);
    });
  },

  handleCityData(data, statusCode) {
    if (statusCode !== 200) {
      this.state.isLoading = false;
      this.state.error = true;
      this.state.errorMessage = data;
      this.state.errorStatus = statusCode;
      this.template();
    } else {
      const serializedData = data.map((city) => {
        const distanceToOSU = distance(
          OSU.lat,
          OSU.lng,
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
    }
  },
};

App.initialize();

function handleSelectChange(e) {
  if (selectSort.value === "asc") {
    renderList(
      sortedCityData.sort((c1, c2) => {
        return c1.distanceToOSU - c2.distanceToOSU;
      })
    );
  } else if (selectSort.value === "desc") {
    renderList(
      sortedCityData
        .sort((c1, c2) => {
          return c1.distanceToOSU - c2.distanceToOSU;
        })
        .reverse()
    );
  } else {
    renderList(cityData);
  }
}

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
  "https://s3-us-west-2.amazonaws.com/cdt-web-storage/cities.jsons",
  true
);
fetchCityData.send();
