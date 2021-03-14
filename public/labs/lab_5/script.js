function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  var map = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwbWFzdDNyIiwiYSI6ImNrbThwcXR0czFhY24ydm9ma2xsN3Vuc3AifQ.W2Le2_wfJM2P4J6y_LCV-A'
}).addTo(map);
  return map;
}

async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
  function findMatches(wordToMatch, food) {
    return food.filter(any => {
        const regex = new RegExp(wordToMatch, 'gi');   
        return (any.zip.match(regex) && any.geocoded_column_1);
    });
  }
  
  console.log('window loaded');
  const form = document.querySelector('.userform');
  const search = document.querySelector('#search_value');
  const targetList = document.querySelector('.target-list');
  const request = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const data = await request.json();
  

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('submit fired', search.value);
    // eslint-disable-next-line camelcase
    food_list = findMatches(search.value.toUpperCase(),data);
    topFive = food_list.slice(0,5);
    console.log(food_list[1]);
    // eslint-disable-next-line max-len
    //const filtered = data.filter((any) => any.name.toUpperCase() === search.value.toUpperCase());
    topFive.forEach((item) => {
      const longLat = item.geocoded_column_1.coordinates;
      const marker = L.marker([longLat[1], longLat[0]]).addTo(mapObjectFromFunction);
      const appendItem = document.createElement('li');
      appendItem.innerHTML = `<span class="name">${item.name}</span>` + ' ' + `<address><span class="address">${item.address_line_1}</span></address>`
      targetList.append(appendItem); 
    });
    const {coordinates} = topFive[0]?.geocoded_column_1
    mapObjectFromFunction.panTo([coordinates[1], coordinates[0]], 0);
  });

  input.addEventListener('input', async (event) => {
    if (search.value == "") {
      food_list = [];
    }
  })
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;