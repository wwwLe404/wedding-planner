package com.example.weddingplanner.repository;

import com.example.weddingplanner.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long>{
    List<Guest> findByWeddingPlanId(Long weddingPlanId);
}
