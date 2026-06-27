package com.example.weddingplanner.service;

import com.example.weddingplanner.entity.Guest;
import com.example.weddingplanner.repository.GuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuestService {
    private final   GuestRepository guestRepository;
    public GuestService(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    public void addGuest(Guest guest){

        guestRepository.save(guest);
    }

    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    public Optional<Guest> getGuestById(Long id) {
        return guestRepository.findById(id);
    }

    public Guest saveGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    public void deleteGuest(Long id) {
        guestRepository.deleteById(id);
    }
}
