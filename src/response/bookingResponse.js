export default class bookingTicketResponse {
  constructor(ticket) {
    this.id = ticket._id;
    this.userId = ticket.userId;
    this.eventId = ticket.eventId;
    this.numberOfTicket = ticket.numberOfTicket;
    this.pricePerTicket = ticket.pricePerTicket;
    this.createdAt = ticket.createdAt;
  }
}
