class userDashboardResponse {
  constructor({ upcomingEventsCount, myTicketsCount, nextEvent, upcomingEvents, myTickets }) {
    this.upcomingEventsCount = upcomingEventsCount;
    this.myTicketsCount = myTicketsCount;
    this.nextEvent = nextEvent ? {
      id: nextEvent._id,
      title: nextEvent.title,
      date: nextEvent.startDateTime,
      image: nextEvent.images?.[0] || null,
      venue: nextEvent.venue,
    } : null;
    this.upcomingEvents = upcomingEvents.map(event => ({
      id: event._id,
      title: event.title,
      date: event.startDateTime,
      venue: event.venue,
      image: event.images?.[0] || null,
    }));
    this.myTickets = myTickets.map(ticket => ({
      id: ticket._id,
      eventTitle: ticket.eventId?.title || "",
      eventDate: ticket.eventId?.startDateTime || "",
      numberOfTickets: ticket.numberOfTicket,
      totalPrice: ticket.numberOfTicket * ticket.pricePerTicket,
      orderDate: ticket.createdAt,
    }));
  }
}

export default userDashboardResponse;
