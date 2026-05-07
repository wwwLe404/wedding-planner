package com.example.weddingplanner.entity;

import jakarta.persistence.*;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String notes;

    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "wedding_plan_id")
    private WeddingPlan weddingPlan;

    public Task() {
    }

    public Task(String title, String notes, boolean completed, WeddingPlan weddingPlan) {
        this.title = title;
        this.notes = notes;
        this.completed = completed;
        this.weddingPlan = weddingPlan;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public WeddingPlan getWeddingPlan() {
        return weddingPlan;
    }

    public void setWeddingPlan(WeddingPlan weddingPlan) {
        this.weddingPlan = weddingPlan;
    }
}
