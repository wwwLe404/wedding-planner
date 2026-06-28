package com.example.weddingplanner.controller;

import com.example.weddingplanner.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWeather(@RequestParam String city) {
        return ResponseEntity.ok(weatherService.getWeatherForCity(city));
    }
}
