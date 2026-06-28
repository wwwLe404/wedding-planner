package com.example.weddingplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vorname darf nicht leer sein")
    private String firstName;

    @NotBlank(message = "Nachname darf nicht leer sein")
    private String lastName;

    private String relationship;
    private String dietaryRestrictions;
    private boolean needsAccommodation;
    private boolean attending;

    @ManyToOne
    @JoinColumn(name = "wedding_plan_id")
    private WeddingPlan weddingPlan;

    public Guest() {}

    public Guest(String firstName, String lastName, String relationship,
                 String dietaryRestrictions, boolean needsAccommodation,
                 boolean attending, WeddingPlan weddingPlan) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.relationship = relationship;
        this.dietaryRestrictions = dietaryRestrictions;
        this.needsAccommodation = needsAccommodation;
        this.attending = attending;
        this.weddingPlan = weddingPlan;
    }

    public Long getId() { return id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getDietaryRestrictions() { return dietaryRestrictions; }
    public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }

    public boolean isNeedsAccommodation() { return needsAccommodation; }
    public void setNeedsAccommodation(boolean needsAccommodation) { this.needsAccommodation = needsAccommodation; }

    public boolean isAttending() { return attending; }
    public void setAttending(boolean attending) { this.attending = attending; }

    public WeddingPlan getWeddingPlan() { return weddingPlan; }
    public void setWeddingPlan(WeddingPlan weddingPlan) { this.weddingPlan = weddingPlan; }
}
