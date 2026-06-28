package com.example.weddingplanner.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class WeatherService {
    private final RestClient restClient = RestClient.create();

    public Map<String, Object> getWeatherForCity(String city) {
        String geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1&language=de&format=json";

        Map geoResponse = restClient.get()
                .uri(geoUrl)
                .retrieve()
                .body(Map.class);

        var results = (java.util.List<Map<String, Object>>) geoResponse.get("results");

        if (results == null || results.isEmpty()) {
            throw new RuntimeException("Ort nicht gefunden: " + city);
        }

        Map<String, Object> location = results.get(0);

        double latitude = ((Number) location.get("latitude")).doubleValue();
        double longitude = ((Number) location.get("longitude")).doubleValue();

        String weatherUrl = "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
                + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
                + "&forecast_days=5"
                + "&timezone=auto";

        Map weatherResponse = restClient.get()
                .uri(weatherUrl)
                .retrieve()
                .body(Map.class);

        return Map.of(
                "city", location.get("name"),
                "country", location.get("country"),
                "latitude", latitude,
                "longitude", longitude,
                "weather", weatherResponse
        );
    }
}
