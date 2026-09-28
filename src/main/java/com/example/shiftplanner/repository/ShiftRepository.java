package com.example.shiftplanner.repository;

import com.example.shiftplanner.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
}