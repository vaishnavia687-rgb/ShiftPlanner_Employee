package com.example.shiftplanner.repository;

import com.example.shiftplanner.entity.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
}