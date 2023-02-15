const OSU = {
  city: "Oregon State University",
  lat: "44.5638",
  lng: "-123.2794",
};

const exerciseContainer = document.getElementById("exercise-a");
const selectSort = document.getElementById("sort");
const cityData = [];
const sortedCityData = [];

selectSort.addEventListener("change", handleSelectChange);

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

function reqListener() {
  const res = JSON.parse(this.responseText);
  const serializedData = res.map((location) => {
    const distanceToOSU = distance(
      OSU.lat,
      OSU.lng,
      location.lat,
      location.lng,
      "M"
    );
    return { ...location, distanceToOSU };
  });
  serializedData.forEach((city) => {
    cityData.push(city);
    sortedCityData.push(city);
  });
  renderList(cityData);
}

function renderList(data) {
  exerciseContainer.innerHTML = "";
  data.map((data) => {
    return (exerciseContainer.innerHTML += `<li>City: ${data.city}<br/>Lat: ${data.lat}<br/>Lng: ${data.lng}<br/>distance to OSU: ${data.distanceToOSU}mi</li>`);
  });
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open(
  "GET",
  "https://s3-us-west-2.amazonaws.com/cdt-web-storage/cities.json",
  true
);
req.send();
