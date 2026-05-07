package com.example.weddingplanner.entity;

import jakarta.persistence.*;

@Entity
public class WeddingPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partnerOneFirstName;

    private String partnerTwoFirstName;

    private String coupleNickname;

    private String location;

    private String weddingDate;

    public WeddingPlan() {
    }

    public WeddingPlan(String partnerOneFirstName, String partnerTwoFirstName, String coupleNickname, String location, String weddingDate) {
        this.partnerOneFirstName = partnerOneFirstName;
        this.partnerTwoFirstName = partnerTwoFirstName;
        this.coupleNickname = coupleNickname;
        this.location = location;
        this.weddingDate = weddingDate;
    }

    public Long getId() {
        return id;
    }

    public String getPartnerOneFirstName() {
        return partnerOneFirstName;
    }

    public void setPartnerOneFirstName(String partnerOneFirstName) {
        this.partnerOneFirstName = partnerOneFirstName;
    }

    public String getPartnerTwoFirstName() {
        return partnerTwoFirstName;
    }

    public void setPartnerTwoFirstName(String partnerTwoFirstName) {
        this.partnerTwoFirstName = partnerTwoFirstName;
    }

    public String getCoupleName() {
        return coupleNickname;
    }

    public void setCoupleName(String coupleName) {
        this.coupleNickname = coupleName;
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
