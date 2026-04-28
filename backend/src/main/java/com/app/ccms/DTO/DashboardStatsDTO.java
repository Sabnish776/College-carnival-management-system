package com.app.ccms.DTO;

public class DashboardStatsDTO {
    private long totalRegistrations;
    private long ticketsSold;

    public DashboardStatsDTO(long totalRegistrations, long ticketsSold) {
        this.totalRegistrations = totalRegistrations;
        this.ticketsSold = ticketsSold;
    }

    // Getters and Setters
    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getTicketsSold() {
        return ticketsSold;
    }

    public void setTicketsSold(long ticketsSold) {
        this.ticketsSold = ticketsSold;
    }
}
