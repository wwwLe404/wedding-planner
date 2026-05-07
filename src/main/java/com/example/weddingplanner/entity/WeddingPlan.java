package com.example.weddingplanner.entity;

import jakarta.persistence.*;

@Entity
public class WeddingPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String coupleName;

    private String location;

    private String weddingDate;

    public WeddingPlan() {
    }

    public WeddingPlan(String coupleName, String location, String weddingDate) {
        this.coupleName = coupleName;
        this.location = location;
        this.weddingDate = weddingDate;
    }

    public Long getId() {
        return id;
    }

    public String getCoupleName() {
        return coupleName;
    }

    public void setCoupleName(String coupleName) {
        this.coupleName = coupleName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWeddingDate() {
        return weddingDate;
    }

    public void setWeddingDate(String weddingDate) {
        this.weddingDate = weddingDate;
    }
}
