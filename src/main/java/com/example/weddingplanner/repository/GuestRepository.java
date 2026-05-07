package com.example.weddingplanner.repository;

import com.example.weddingplanner.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GuestRepository extends JpaRepository<Guest, Long>{
}
