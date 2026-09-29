package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Roster;
import com.example.shiftplanner.entity.SwapRequest;
import com.example.shiftplanner.entity.SwapStatus;
import com.example.shiftplanner.repository.RosterRepository;
import com.example.shiftplanner.repository.SwapRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final RosterRepository rosterRepository;

    public SwapRequestService(
            SwapRequestRepository swapRequestRepository,
            RosterRepository rosterRepository) {

        this.swapRequestRepository = swapRequestRepository;
        this.rosterRepository = rosterRepository;
    }

    // CREATE SWAP REQUEST
    public SwapRequest createSwapRequest(SwapRequest swapRequest) {

        swapRequest.setStatus(SwapStatus.PENDING_MANAGER);

        return swapRequestRepository.save(swapRequest);
    }

    // GET ALL SWAP REQUESTS
    public List<SwapRequest> getAllSwapRequests() {

        return swapRequestRepository.findAll();
    }

    // MANAGER APPROVE
    public SwapRequest managerApprove(Long id) {

        SwapRequest swapRequest =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"
                                )
                        );

        // CHECK STATUS
        if (swapRequest.getStatus()
                != SwapStatus.PENDING_MANAGER) {

            throw new RuntimeException(
                    "This swap request is not waiting for manager approval"
            );
        }

        // CHECK REQUESTER SHIFT
        if (swapRequest.getRequesterShift() == null) {

            throw new RuntimeException(
                    "Requester shift is missing in this swap request"
            );
        }

        // CHECK COLLEAGUE SHIFT
        if (swapRequest.getColleagueShift() == null) {

            throw new RuntimeException(
                    "Colleague shift is missing in this swap request"
            );
        }

        // CHECK REQUESTER
        if (swapRequest.getRequester() == null) {

            throw new RuntimeException(
                    "Requester is missing in this swap request"
            );
        }

        // CHECK COLLEAGUE
        if (swapRequest.getColleague() == null) {

            throw new RuntimeException(
                    "Colleague is missing in this swap request"
            );
        }

        // FIND REQUESTER ROSTER
        Roster requesterRoster =
                rosterRepository.findAll()
                        .stream()
                        .filter(roster ->
                                roster.getEmployee() != null
                                        && roster.getShift() != null
                                        && roster.getEmployee().getId()
                                        .equals(
                                                swapRequest
                                                        .getRequester()
                                                        .getId()
                                        )
                                        && roster.getShift().getId()
                                        .equals(
                                                swapRequest
                                                        .getRequesterShift()
                                                        .getId()
                                        )
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requester roster not found"
                                )
                        );

        // FIND COLLEAGUE ROSTER
        Roster colleagueRoster =
                rosterRepository.findAll()
                        .stream()
                        .filter(roster ->
                                roster.getEmployee() != null
                                        && roster.getShift() != null
                                        && roster.getEmployee().getId()
                                        .equals(
                                                swapRequest
                                                        .getColleague()
                                                        .getId()
                                        )
                                        && roster.getShift().getId()
                                        .equals(
                                                swapRequest
                                                        .getColleagueShift()
                                                        .getId()
                                        )
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Colleague roster not found"
                                )
                        );

        // SWAP THE EMPLOYEES
        requesterRoster.setEmployee(
                swapRequest.getColleague()
        );

        colleagueRoster.setEmployee(
                swapRequest.getRequester()
        );

        // SAVE ROSTERS
        rosterRepository.save(requesterRoster);
        rosterRepository.save(colleagueRoster);

        // UPDATE STATUS
        swapRequest.setStatus(
                SwapStatus.MANAGER_APPROVED
        );

        return swapRequestRepository.save(
                swapRequest
        );
    }

    // MANAGER DECLINE
    public SwapRequest managerReject(Long id) {

        SwapRequest swapRequest =
                swapRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Swap request not found"
                                )
                        );

        if (swapRequest.getStatus()
                != SwapStatus.PENDING_MANAGER) {

            throw new RuntimeException(
                    "This swap request is not waiting for manager approval"
            );
        }

        swapRequest.setStatus(
                SwapStatus.MANAGER_REJECTED
        );

        return swapRequestRepository.save(
                swapRequest
        );
    }
}