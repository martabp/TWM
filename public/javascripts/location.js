document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('btn-geolocate');
  const message = document.getElementById('geo-message');
  const locations = window.locationsData || [];

  // ============================
  // GEOLOCALIZACIÓN
  // ============================
  if (button) {
    button.addEventListener('click', function () {
      if (!navigator.geolocation) {
        if (message) {
          message.textContent = 'Tu navegador no soporta geolocalización.';
        }
        return;
      }

      if (message) {
        message.textContent = 'Buscando tu ubicación...';
      }

      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (message) {
            message.textContent = 'Redirigiendo...';
          }

          window.location.href = `/?lng=${lng}&lat=${lat}`;
        },
        function (error) {
          console.error(error);
          if (message) {
            message.textContent = 'No se pudo obtener tu ubicación.';
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000
        }
      );
    });
  }

  // ============================
  // MAPA LEAFLET
  // ============================
  const mapElement = document.getElementById('map');

  if (mapElement && typeof L !== 'undefined') {
    const map = L.map('map');

    // Vista inicial por defecto
    map.setView([36.834, -2.4637], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markers = [];

    locations.forEach(function (location) {
      if (
        location.coords &&
        location.coords.coordinates &&
        location.coords.coordinates.length === 2
      ) {
        const lng = location.coords.coordinates[0];
        const lat = location.coords.coordinates[1];

        const marker = L.marker([lat, lng]).addTo(map);

        marker.bindPopup(`
          <strong><a href="/location/${location._id}">${location.name || 'Sin nombre'}</a></strong><br>
          ${location.address || ''}
        `);

        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }
});