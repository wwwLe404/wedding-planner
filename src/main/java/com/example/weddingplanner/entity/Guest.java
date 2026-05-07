package com.example.weddingplanner.entity;

import jakarta.persistence.*;

@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean attending;

    @ManyToOne
    @JoinColumn(name = "wedding_plan_id")
    private WeddingPlan weddingPlan;

    public Guest() {
    }

    public Guest(String name, boolean attending, WeddingPlan weddingPlan) {
        this.name = name;
        this.attending = attending;
        this.weddingPlan = weddingPlan;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isAttending() {
        return attending;
    }

    public WeddingPlan getWeddingPlan() {
        return weddingPlan;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAttending(boolean attending) {
        this.attending = attending;
    }

    public void setWeddingPlan(WeddingPlan weddingPlan) {
        this.weddingPlan = weddingPlan;
    }
}
