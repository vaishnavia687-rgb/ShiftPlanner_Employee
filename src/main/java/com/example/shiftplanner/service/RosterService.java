package com.example.shiftplanner.service;

import com.example.shiftplanner.entity.Roster;
import com.example.shiftplanner.repository.RosterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RosterService {

    private final RosterRepository rosterRepository;

    public RosterService(RosterRepository rosterRepository) {
        this.rosterRepository = rosterRepository;
    }

    public Roster assignShift(Roster roster) {

        boolean overlapping = rosterRepository.findAll()
                .stream()
                .filter(existingRoster ->
                        existingRoster.getEmployee().getId()
                                .equals(roster.getEmployee().getId()))
                .anyMatch(existingRoster -> {

                    var existingShift =
                            existingRoster.getShift();

                    var newShift =
                            roster.getShift();

                    return existingShift.getDate()
                            .equals(newShift.getDate())

                            && newShift.getStartTime()
                            .isBefore(existingShift.getEndTime())

                            && newShift.getEndTime()
                            .isAfter(existingShift.getStartTime());
                });

        if (overlapping) {

            throw new RuntimeException(
                    "Employee already has an overlapping shift on this day"
            );
        }

        return rosterRepository.save(roster);
    }


    public List<Roster> getAllRosters() {

        return rosterRepository.findAll();
    }


    public void deleteRoster(Long id) {

        Roster roster = rosterRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Roster not found"));

        rosterRepository.delete(roster);
    }
}