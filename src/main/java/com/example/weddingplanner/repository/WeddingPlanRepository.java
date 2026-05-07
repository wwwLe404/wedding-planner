package com.example.weddingplanner.repository;

import com.example.weddingplanner.entity.WeddingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WeddingPlanRepository extends JpaRepository<WeddingPlan, Long> {
}
