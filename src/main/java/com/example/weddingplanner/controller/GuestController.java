package com.example.weddingplanner.controller;

import com.example.weddingplanner.entity.Guest;
import com.example.weddingplanner.service.GuestService;
import com.example.weddingplanner.entity.WeddingPlan;
import com.example.weddingplanner.service.WeddingPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
    private final GuestService guestService;
    private final WeddingPlanService weddingPlanService;

    public GuestController(
            GuestService guestService,
            WeddingPlanService weddingPlanService
    ) {
        this.guestService = guestService;
        this.weddingPlanService = weddingPlanService;
    }

    @GetMapping
    public List<Guest> getAllGuests() {
        return guestService.getAllGuests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return guestService.getGuestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Guest createGuest(@Valid @RequestBody Guest guest) {
        return guestService.saveGuest(guest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(
            @PathVariable Long id,
            @Valid @RequestBody Guest updatedGuest
    ) {
        return guestService.getGuestById(id)
                .map(existingGuest -> {
                    existingGuest.setFirstName(updatedGuest.getFirstName());
                    existingGuest.setLastName(updatedGuest.getLastName());
                    existingGuest.setRelationship(updatedGuest.getRelationship());
                    existingGuest.setDietaryRestrictions(updatedGuest.getDietaryRestrictions());
                    existingGuest.setNeedsAccommodation(updatedGuest.isNeedsAccommodation());
                    existingGuest.setAttendingStatus(updatedGuest.getAttendingStatus());
                    existingGuest.setWeddingPlan(updatedGuest.getWeddingPlan());

                    Guest savedGuest = guestService.saveGuest(existingGuest);
                    return ResponseEntity.ok(savedGuest);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        if (guestService.getGuestById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/wedding-plan/{weddingPlanId}")
    public ResponseEntity<Guest> createGuestForWeddingPlan(
            @PathVariable Long weddingPlanId,
            @Valid @RequestBody Guest guest) {
        return weddingPlanService.getWeddingPlanById(weddingPlanId)
                .map(weddingPlan -> {
                    guest.setWeddingPlan(weddingPlan);
                    Guest savedGuest = guestService.saveGuest(guest);
                    return ResponseEntity.ok(savedGuest);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
