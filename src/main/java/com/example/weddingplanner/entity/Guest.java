package com.example.weddingplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Guest {
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
    @NotNull(message = "Status darf nicht leer sein")
    private String attendingStatus; // "ATTENDING", "NOT_ATTENDING", "PENDING"

    @ManyToOne
    @JoinColumn(name = "wedding_plan_id")
    private WeddingPlan weddingPlan;

    public Guest() {}

    public Guest(String firstName, String lastName, String relationship,
                 String dietaryRestrictions, boolean needsAccommodation,
                 String attendingStatus, WeddingPlan weddingPlan) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.relationship = relationship;
        this.dietaryRestrictions = dietaryRestrictions;
        this.needsAccommodation = needsAccommodation;
        this.attendingStatus = attendingStatus;
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

    public String getAttendingStatus() { return attendingStatus; }
    public void setAttendingStatus(String attendingStatus) { this.attendingStatus = attendingStatus; }

    public WeddingPlan getWeddingPlan() { return weddingPlan; }
    public void setWeddingPlan(WeddingPlan weddingPlan) { this.weddingPlan = weddingPlan; }
}
