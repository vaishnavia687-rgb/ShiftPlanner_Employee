  package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Shift;
import com.example.shiftplanner.repository.RosterRepository;
import com.example.shiftplanner.repository.ShiftRepository;
import com.example.shiftplanner.repository.SwapRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final RosterRepository rosterRepository;
    private final SwapRequestRepository swapRequestRepository;

    public ShiftService(
            ShiftRepository shiftRepository,
            RosterRepository rosterRepository,
            SwapRequestRepository swapRequestRepository) {

        this.shiftRepository = shiftRepository;
        this.rosterRepository = rosterRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    // CREATE
    public Shift addShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    // READ
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    // UPDATE
    public Shift updateShift(Long id, Shift shift) {

        Shift existingShift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        existingShift.setShiftName(shift.getShiftName());
        existingShift.setDate(shift.getDate());
        existingShift.setStartTime(shift.getStartTime());
        existingShift.setEndTime(shift.getEndTime());

        return shiftRepository.save(existingShift);
    }

    // DELETE
    public void deleteShift(Long id) {

        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        // Delete swap requests involving this shift
        swapRequestRepository.findAll().stream()
                .filter(request ->
                        (request.getRequesterShift() != null &&
                                request.getRequesterShift().getId().equals(id))
                                ||
                                (request.getColleagueShift() != null &&
                                        request.getColleagueShift().getId().equals(id))
                )
                .forEach(swapRequestRepository::delete);

        // Delete roster records involving this shift
        rosterRepository.findAll().stream()
                .filter(roster ->
                        roster.getShift() != null &&
                                roster.getShift().getId().equals(id)
                )
                .forEach(rosterRepository::delete);

        // Finally delete the shift
        shiftRepository.delete(shift);
    }
}

