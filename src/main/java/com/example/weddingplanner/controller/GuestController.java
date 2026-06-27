package com.example.weddingplanner.controller;

import com.example.weddingplanner.entity.Guest;
import com.example.weddingplanner.service.GuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
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
    public Guest createGuest(@RequestBody Guest guest) {
        return guestService.saveGuest(guest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(
            @PathVariable Long id,
            @RequestBody Guest updatedGuest
    ) {
        return guestService.getGuestById(id)
                .map(existingGuest -> {
                    existingGuest.setFirstName(updatedGuest.getFirstName());
                    existingGuest.setLastName(updatedGuest.getLastName());
                    existingGuest.setRelationship(updatedGuest.getRelationship());
                    existingGuest.setDietaryRestrictions(updatedGuest.getDietaryRestrictions());
                    existingGuest.setNeedsAccommodation(updatedGuest.isNeedsAccommodation());
                    existingGuest.setAttending(updatedGuest.isAttending());
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
}
