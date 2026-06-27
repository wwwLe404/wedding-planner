package com.example.weddingplanner.service;

import com.example.weddingplanner.entity.WeddingPlan;
import com.example.weddingplanner.repository.WeddingPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeddingPlanService {
    private final WeddingPlanRepository weddingPlanRepository;

    public WeddingPlanService(WeddingPlanRepository weddingPlanRepository) {
        this.weddingPlanRepository = weddingPlanRepository;
    }

    public List<WeddingPlan> getAllWeddingPlans() {
        return weddingPlanRepository.findAll();
    }

    public Optional<WeddingPlan> getWeddingPlanById(Long id) {
        return weddingPlanRepository.findById(id);
    }

    public WeddingPlan saveWeddingPlan(WeddingPlan weddingPlan) {
        return weddingPlanRepository.save(weddingPlan);
    }

    public void deleteWeddingPlan(Long id) {
        weddingPlanRepository.deleteById(id);
    }
}
