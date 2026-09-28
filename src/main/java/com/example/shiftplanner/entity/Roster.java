package com.example.shiftplanner.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rosters")
public class Roster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;

    public Roster() {
    }

    public Roster(Employee employee, Shift shift) {
        this.employee = employee;
        this.shift = shift;
    }

    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }
}