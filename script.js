// NASA API Key
const NASA_API_KEY = 'sHvSsCPEazLtXKsdefNeGePNaJallYXNKyJKtQo3';

// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default view (world map)

// Add a tile layer (you can use OpenStreetMap or other map providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Function to update the map with the user's location
function updateLocation(latitude, longitude) {
  // Remove any existing marker
  if (window.marker) {
    map.removeLayer(window.marker);
  }

  // Add a new marker at the user's location
  window.marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

  // Center the map on the user's location
  map.setView([latitude, longitude], 13);

  // Update the location text
  document.getElementById('location').textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;

  // Fetch NASA satellite imagery for the location
  fetchNASASatelliteImagery(latitude, longitude);
}

// Function to fetch NASA satellite imagery
function fetchNASASatelliteImagery(lat, lon) {
  const url = `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=2023-10-01&dim=0.1&api_key=${NASA_API_KEY}`;

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const imageUrl = URL.createObjectURL(blob);
      const nasaImage = document.getElementById('nasa-image');
      nasaImage.src = imageUrl;
      nasaImage.style.display = 'block';
      document.getElementById('nasa-info').textContent = 'Satellite imagery loaded successfully!';
    })
    .catch(error => {
      console.error('Error fetching NASA imagery:', error);
      document.getElementById('nasa-info').textContent = 'Failed to load satellite imagery.';
    });
}

// Get the user's current location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      updateLocation(latitude, longitude);
    },
    (error) => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location. Please enable location access.');
    },
    {
      enableHighAccuracy: true, // Use high-accuracy mode
      timeout: 5000, // Timeout after 5 seconds
      maximumAge: 0 // Force fresh location data
    }
  );
} else {
  alert('Geolocation is not supported by your browser.');
}