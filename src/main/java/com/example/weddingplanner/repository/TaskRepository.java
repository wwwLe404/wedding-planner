package com.example.weddingplanner.repository;

import com.example.weddingplanner.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findByWeddingPlanId(Long weddingPlanId);
}
