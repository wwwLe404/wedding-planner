package com.example.weddingplanner.controller;

import com.example.weddingplanner.entity.Task;
import com.example.weddingplanner.service.TaskService;
import com.example.weddingplanner.service.WeddingPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final WeddingPlanService weddingPlanService;

    public TaskController(
            TaskService taskService,
            WeddingPlanService weddingPlanService
    ) {
        this.taskService = taskService;
        this.weddingPlanService = weddingPlanService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask
    ) {
        return taskService.getTaskById(id)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setNotes(updatedTask.getNotes());
                    existingTask.setCompleted(updatedTask.isCompleted());
                    existingTask.setWeddingPlan(updatedTask.getWeddingPlan());

                    Task savedTask = taskService.saveTask(existingTask);
                    return ResponseEntity.ok(savedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskService.getTaskById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/wedding-plan/{weddingPlanId}")
    public ResponseEntity<Task> createTaskForWeddingPlan(
            @PathVariable Long weddingPlanId,
            @RequestBody Task task
    ) {
        return weddingPlanService.getWeddingPlanById(weddingPlanId)
                .map(weddingPlan -> {
                    task.setWeddingPlan(weddingPlan);
                    Task savedTask = taskService.saveTask(task);
                    return ResponseEntity.ok(savedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
