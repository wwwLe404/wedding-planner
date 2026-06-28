package com.example.weddingplanner.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class WeddingPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vorname Partner 1 darf nicht leer sein")
    private String partnerOneFirstName;

    @NotBlank(message = "Vorname Partner 2 darf nicht leer sein")
    private String partnerTwoFirstName;

    private String coupleNickname;

    @NotBlank(message = "Ort darf nicht leer sein")
    private String location;

    @NotNull(message = "Hochzeitsdatum darf nicht leer sein")
    private LocalDate weddingDate;

    public WeddingPlan() {}

    public WeddingPlan(String partnerOneFirstName, String partnerTwoFirstName,
                       String coupleNickname, String location, LocalDate weddingDate) {
        this.partnerOneFirstName = partnerOneFirstName;
        this.partnerTwoFirstName = partnerTwoFirstName;
        this.coupleNickname = coupleNickname;
        this.location = location;
        this.weddingDate = weddingDate;
    }

    public Long getId() { return id; }

    public String getPartnerOneFirstName() { return partnerOneFirstName; }
    public void setPartnerOneFirstName(String partnerOneFirstName) { this.partnerOneFirstName = partnerOneFirstName; }

    public String getPartnerTwoFirstName() { return partnerTwoFirstName; }
    public void setPartnerTwoFirstName(String partnerTwoFirstName) { this.partnerTwoFirstName = partnerTwoFirstName; }

    public String getCoupleName() { return coupleNickname; }
    public void setCoupleName(String coupleName) { this.coupleNickname = coupleName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getWeddingDate() { return weddingDate; }
    public void setWeddingDate(LocalDate weddingDate) { this.weddingDate = weddingDate; }
}
