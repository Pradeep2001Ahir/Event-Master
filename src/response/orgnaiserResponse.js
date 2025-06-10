class organizerDashboardResponse {
  constructor({ totalEvents, totalTicketsSold, totalRevenue, events, upcomingEventCount }) {
    this.totalEvents = totalEvents;
    this.upcomingEventCount = upcomingEventCount; // 🔥 new
    this.totalTicketsSold = totalTicketsSold;
    this.totalRevenue = totalRevenue;
    this.events = events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.startDateTime,
      image: event.images?.[0] || null,
      price: event.ticketPrice,
      capacity: event.capacity
    }));
  }
}

export default organizerDashboardResponse;
