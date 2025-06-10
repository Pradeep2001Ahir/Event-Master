//NPM
import { validationResult } from "express-validator";
//Model
import bookingModel from "../../model/booking.js";
import eventModel from "../../model/event.js";
//Function
import { getMessage } from "../../helper/common/helper.js";
import mongoose from "mongoose";
//Response
import TicketResponse from "../../response/ticketResponse.js";
import bookingTicketResponse from "../../response/bookingResponse.js";

export const bookingTicket = async (req, res) => {
  try {
    const {
      numberOfTicket,
      eventId,
      language = "en",
    } = req.body;
    const userId = req.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    //check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language, "Data_Not_Found"),
      });
    }

    //cheking total booked so far
    const totalBookedResult = await bookingModel.aggregate([
      {
        $match : {
          eventId : new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $group : {
          _id : null,
          total : {$sum : "$numberOfTicket"},
        },
      },
    ]);

    let alreadyBooked = 0;
if (Array.isArray(totalBookedResult) && totalBookedResult.length > 0) {
  alreadyBooked = totalBookedResult[0].total || 0;
}

    const remainingCapacity = event.capacity - alreadyBooked;
    
    //checking capacity
    if (numberOfTicket > remainingCapacity) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, "Event_Capacity_Exceeded") || "Not enough tickets available",
         data: {
          requested: numberOfTicket,
          available: remainingCapacity,
        },
      });
    }

    //Calculate total price
   // const pricePerTicket = event.ticketPrice;
    const totalPrice = numberOfTicket * event.ticketPrice;

    const booking = new bookingModel({
      userId: userId,
      eventId: eventId,
      numberOfTicket: numberOfTicket,
      pricePerTicket : event.ticketPrice
    });

    const saveBooking = await booking.save();

   
    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Booking_Success"),
      data: {
        ticket: new bookingTicketResponse(saveBooking),
        totalPrice,
        remainingCapacity: remainingCapacity - numberOfTicket,
      },
    });
  } catch (error) {
    return res.send({
      status: true,
      message: error.message,
    });
  }
};




//My Ticket
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const language = req.query.language || "en";

    const bookings = await bookingModel
      .find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    const upcoming = [];
    const past = [];

    for (let booking of bookings) {
      const event = booking.eventId;
      if (!event) continue;

      const ticket = new TicketResponse(booking, event);

      if (new Date(event.startDateTime) > new Date()) {
        upcoming.push(ticket);
      } else {
        past.push(ticket);
      }
    }

    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Tickets_Fetched_Success"),
      data: {
        upcoming,
        past
      }
    });

  } catch (error) {
    return res.send({
      status: false,
      message: error.message
    });
  }
};
