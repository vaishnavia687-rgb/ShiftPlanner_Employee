package com.example.shiftplanner.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private Employee requester;

    @ManyToOne
    @JoinColumn(name = "colleague_id")
    private Employee colleague;

    @ManyToOne
    @JoinColumn(name = "requester_shift_id")
    private Shift requesterShift;

    @ManyToOne
    @JoinColumn(name = "colleague_shift_id")
    private Shift colleagueShift;

    @Enumerated(EnumType.STRING)
    private SwapStatus status;

    public SwapRequest() {
    }

    public SwapRequest(Employee requester, Employee colleague,
                       Shift requesterShift, Shift colleagueShift) {
        this.requester = requester;
        this.colleague = colleague;
        this.requesterShift = requesterShift;
        this.colleagueShift = colleagueShift;
        this.status = SwapStatus.PENDING_MANAGER;
    }

    public Long getId() {
        return id;
    }

    public Employee getRequester() {
        return requester;
    }

    public void setRequester(Employee requester) {
        this.requester = requester;
    }

    public Employee getColleague() {
        return colleague;
    }

    public void setColleague(Employee colleague) {
        this.colleague = colleague;
    }

    public Shift getRequesterShift() {
        return requesterShift;
    }

    public void setRequesterShift(Shift requesterShift) {
        this.requesterShift = requesterShift;
    }

    public Shift getColleagueShift() {
        return colleagueShift;
    }

    public void setColleagueShift(Shift colleagueShift) {
        this.colleagueShift = colleagueShift;
    }

    public SwapStatus getStatus() {
        return status;
    }

    public void setStatus(SwapStatus status) {
        this.status = status;
    }
}