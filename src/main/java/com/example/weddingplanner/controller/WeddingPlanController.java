package com.example.weddingplanner.controller;

import com.example.weddingplanner.entity.WeddingPlan;
import com.example.weddingplanner.service.WeddingPlanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wedding-plans")
public class WeddingPlanController {
    private final WeddingPlanService weddingPlanService;

    public WeddingPlanController(WeddingPlanService weddingPlanService) {
        this.weddingPlanService = weddingPlanService;
    }

    @GetMapping
    public List<WeddingPlan> getAllWeddingPlans() {
        return weddingPlanService.getAllWeddingPlans();
    }

    @PostMapping
    public WeddingPlan createWeddingPlan(@RequestBody WeddingPlan weddingPlan) {
        return weddingPlanService.saveWeddingPlan(weddingPlan);
    }
}
