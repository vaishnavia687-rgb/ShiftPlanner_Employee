package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Shift;
import com.example.shiftplanner.repository.ShiftRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;

    public ShiftService(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
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
    public Shift updateShift(Long id, Shift shiftDetails) {

        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Shift not found"));

        shift.setShiftName(shiftDetails.getShiftName());
        shift.setDate(shiftDetails.getDate());
        shift.setStartTime(shiftDetails.getStartTime());
        shift.setEndTime(shiftDetails.getEndTime());

        return shiftRepository.save(shift);
    }

    // DELETE
    public void deleteShift(Long id) {

        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Shift not found"));

        shiftRepository.delete(shift);
    }
}