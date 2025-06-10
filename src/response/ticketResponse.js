class TicketResponse {
  constructor(booking, event) {
    const dateTime = new Date(event?.startDateTime);

    this.eventTitle = event?.title || "";
    this.eventDate = dateTime.toISOString().split("T")[0]; // e.g., "2025-06-08"
    this.eventTime = dateTime.toISOString().split("T")[1]?.slice(0, 5); // e.g., "14:00"
    this.venue = event?.venue || "";
    this.numberOfTickets = booking?.numberOfTicket || 0;
    this.totalPrice = this.numberOfTickets * (booking?.pricePerTicket || 0);
    this.orderDate = booking?.createdAt || "";
  }
}

export default TicketResponse;
