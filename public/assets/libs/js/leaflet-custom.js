// ==============================================================
// Leaftlet
// ==============================================================
var mymap = L.map('mapid').setView([-19.759487, -47.954141], 16);

L.tileLayer(
  'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=dZdHYLvJoWcUMH4tAbxq',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token',
  }
).addTo(mymap);

var markers = [
  {
    id: 0,
    popup: '<b>Padaria Dona Maria</b>',
    position: [-19.759487, -47.954141],
  },
  {
    id: 1,
    popup: '<b>Restaurante Minas</b>',
    position: [-19.759187, -47.954841],
  },
  {
    id: 2,
    popup: '<b>Padaria Sertão</b>',
    position: [-19.757487, -47.953941],
  },
  {
    id: 3,
    popup: '<b>Pizzaria Quero +</b>',
    position: [-19.761487, -47.953941],
  },
  {
    id: 4,
    popup: '<b>Padaria Duvica</b>',
    position: [-19.760287, -47.951541],
  },
  {
    id: 5,
    popup: '',
    position: [-19.760373, -47.945995],
  },
  {
    id: 6,
    popup: '',
    position: [-19.757622, -47.956351],
  },
  {
    id: 7,
    popup: '',
    position: [-19.761224, -47.947957],
  },
];

var marker;
for (const m of markers) {
  marker = L.marker(m.position);
  marker.bindPopup(m.popup);
  marker.addTo(mymap);
  if (!m.id) marker.openPopup();
}

const markerContainers = document.querySelectorAll('.leaflet-popup-content');
markerContainers.forEach(container => (container.style.textAlign = 'center'));
