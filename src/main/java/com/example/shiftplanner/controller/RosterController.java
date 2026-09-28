package com.example.shiftplanner.controller;

import com.example.shiftplanner.entity.Roster;
import com.example.shiftplanner.service.RosterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rosters")
public class RosterController {

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @PostMapping
    public Roster assignShift(@RequestBody Roster roster) {
        return rosterService.assignShift(roster);
    }

    @GetMapping
    public List<Roster> getAllRosters() {
        return rosterService.getAllRosters();
    }
    @DeleteMapping("/{id}")
    public String deleteRoster(@PathVariable Long id) {

        rosterService.deleteRoster(id);

        return "Roster deleted successfully";
    }
}