package com.example.shiftplanner.controller;

import com.example.shiftplanner.entity.SwapRequest;
import com.example.shiftplanner.service.SwapRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swap-requests")
@CrossOrigin(origins = "*")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(
            SwapRequestService swapRequestService) {

        this.swapRequestService = swapRequestService;
    }

    // CREATE SWAP REQUEST
    @PostMapping
    public SwapRequest createSwapRequest(
            @RequestBody SwapRequest swapRequest) {

        return swapRequestService.createSwapRequest(swapRequest);
    }

    // GET ALL SWAP REQUESTS
    @GetMapping
    public List<SwapRequest> getAllSwapRequests() {

        return swapRequestService.getAllSwapRequests();
    }

    // MANAGER APPROVE
    @PutMapping("/{id}/approve")
    public SwapRequest managerApprove(
            @PathVariable Long id) {

        return swapRequestService.managerApprove(id);
    }

    // MANAGER DECLINE
    @PutMapping("/{id}/reject")
    public SwapRequest managerReject(
            @PathVariable Long id) {

        return swapRequestService.managerReject(id);
    }
}