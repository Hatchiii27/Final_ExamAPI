document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "6b0f8e0e06a446518ce6a060073a6f17";
    const form = document.getElementById("cityForm");


    const map = L.map('map').setView([51.505, -0.09], 10); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(geoUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`City not found (${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.coord) {
                    const lat = data.coord.lat;
                    const lon = data.coord.lon;
                    map.setView([lat, lon], 10); 

                   
                    map.eachLayer(function(layer) {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });

                   
                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`<b>${city}</b><br>Temperature: ${data.main.temp}°C`)
                        .openPopup();
                } else {
                    
                    alert("City not found.");
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                alert(`Error fetching location data: ${error.message}`);
            });
    }
});
