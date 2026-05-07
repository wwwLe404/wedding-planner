package com.example.weddingplanner.repository;

import com.example.weddingplanner.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TaskRepository extends JpaRepository<Task, Long>{
}
