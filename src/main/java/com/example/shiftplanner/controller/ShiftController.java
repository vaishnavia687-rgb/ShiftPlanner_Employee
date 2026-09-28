package com.example.shiftplanner.controller;

import com.example.shiftplanner.entity.Shift;
import com.example.shiftplanner.service.ShiftService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(origins = "*")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    // CREATE
    @PostMapping
    public Shift addShift(@RequestBody Shift shift) {
        return shiftService.addShift(shift);
    }

    // READ
    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    // UPDATE
    @PutMapping("/{id}")
    public Shift updateShift(
            @PathVariable Long id,
            @RequestBody Shift shift) {

        return shiftService.updateShift(id, shift);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteShift(@PathVariable Long id) {

        shiftService.deleteShift(id);

        return "Shift deleted successfully";
    }
}