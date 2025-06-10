class adminDashboardResponse {
  constructor({
    totalEvents,
    upcomingEvents,
    users,
    totalTicketsSold,
    totalRevenue,
    averagePerTicket,
    totalBookingEntries,
    upcomingEventList = [],
  }) {
    this.totalEvents = totalEvents;
    this.upcomingEvents = upcomingEvents;
    this.users = users;
    this.totalTicketsSold = totalTicketsSold;
    this.totalRevenue = totalRevenue;
    this.averagePerTicket = averagePerTicket;
    this.totalBookingEntries = totalBookingEntries; // 👈 new property
    this.upcomingEventList = upcomingEventList.map((event) => ({
      id: event._id,
      title: event.title,
      date: event.startDateTime,
      venue: event.venue,
      price: event.ticketPrice,
    }));
  }
}

export default adminDashboardResponse;
