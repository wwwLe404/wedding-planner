package com.example.weddingplanner.controller;

import com.example.weddingplanner.entity.WeddingPlan;
import com.example.weddingplanner.service.WeddingPlanService;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<WeddingPlan> getWeddingPlanById(@PathVariable Long id) {
        return weddingPlanService.getWeddingPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public WeddingPlan createWeddingPlan(@RequestBody WeddingPlan weddingPlan) {
        return weddingPlanService.saveWeddingPlan(weddingPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeddingPlan> updateWeddingPlan(
            @PathVariable Long id,
            @RequestBody WeddingPlan updatedWeddingPlan
    ) {
        return weddingPlanService.getWeddingPlanById(id)
                .map(existingWeddingPlan -> {
                    existingWeddingPlan.setPartnerOneFirstName(updatedWeddingPlan.getPartnerOneFirstName());
                    existingWeddingPlan.setPartnerTwoFirstName(updatedWeddingPlan.getPartnerTwoFirstName());
                    existingWeddingPlan.setCoupleName(updatedWeddingPlan.getCoupleName());
                    existingWeddingPlan.setLocation(updatedWeddingPlan.getLocation());
                    existingWeddingPlan.setWeddingDate(updatedWeddingPlan.getWeddingDate());

                    WeddingPlan savedWeddingPlan = weddingPlanService.saveWeddingPlan(existingWeddingPlan);
                    return ResponseEntity.ok(savedWeddingPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeddingPlan(@PathVariable Long id) {
        if (weddingPlanService.getWeddingPlanById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        weddingPlanService.deleteWeddingPlan(id);
        return ResponseEntity.noContent().build();
    }
}
