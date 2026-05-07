package com.example.weddingplanner.entity;

import jakarta.persistence.*;

@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private boolean needsAccommodation;
    private boolean attending;

    @ManyToOne
    @JoinColumn(name = "wedding_plan_id")
    private WeddingPlan weddingPlan;

    public Guest() {
    }

    public Guest(String firstName, String lastName,boolean needsAccommodation,boolean attending ,WeddingPlan weddingPlan) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.needsAccommodation = needsAccommodation;
        this.attending = attending;
        this.weddingPlan = weddingPlan;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public boolean isNeedsAccommodation() {
        return needsAccommodation;
    }

    public boolean isAttending() {
        return attending;
    }

    public WeddingPlan getWeddingPlan() {
        return weddingPlan;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setNeedsAccommodation(boolean needsAccommodation) {
        this.needsAccommodation = needsAccommodation;
    }

    public void setAttending(boolean attending) {
        this.attending = attending;
    }

    public void setWeddingPlan(WeddingPlan weddingPlan) {
        this.weddingPlan = weddingPlan;
    }
}
