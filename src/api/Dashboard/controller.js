//Model
import bookingModel from "../../model/booking.js";
import eventModel from "../../model/event.js";
import userModel from "../../model/user.js";
//Function
import { getMessage } from "../../helper/common/helper.js";
//Response
import organizerDashboardResponse from "../../response/orgnaiserResponse.js";
import adminDashboardResponse from "../../response/adminResponse.js";
import userDashboardResponse from "../../response/userDashboardResponse.js";

export const getOrganizerDashboard = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const language = req.query.language || "en";

    const events = await eventModel.find({ userId: organizerId });
    const totalEvents = events.length;
    const eventIds = events.map((event) => event._id);

    const upcomingEventCount = events.filter(
      (event) => new Date(event.startDateTime) > new Date()
    ).length;

    const stats = await bookingModel.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
        },
      },
      {
        $group: {
          _id: null,
          totalTicketsSold: { $sum: "$numberOfTicket" },
          totalRevenue: {
            $sum: { $multiply: ["$numberOfTicket", "$pricePerTicket"] },
          },
        },
      },
    ]);

    const totalTicketsSold = stats?.[0]?.totalTicketsSold || 0;
    const totalRevenue = stats?.[0]?.totalRevenue || 0;

    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Dashboard_Data_Fetched"),
      data: new organizerDashboardResponse({
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        events,
        upcomingEventCount,
      }),
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//admin dashboard

export const getAdminDashboardData = async (req, res) => {
  try {
    const language = req.query.language || "en";

    // Total Events
    const totalEvents = await eventModel.countDocuments();

    // Upcoming Events
    const upcomingEvents = await eventModel.countDocuments({
      startDateTime: { $gt: new Date() },
    });

    // User roles count
    const userRoleData = await userModel.aggregate([
      {
        $group: {
          _id: { $toLower: "$userRole" },
          count: { $sum: 1 },
        },
      },
    ]);

    const userRoleCounts = {
      admin: 0,
      organizer: 0,
      user: 0,
    };

    userRoleData.forEach((item) => {
      if (userRoleCounts.hasOwnProperty(item._id)) {
        userRoleCounts[item._id] = item.count;
      }
    });

    // Tickets sold, revenue, and total booking entries
    const ticketStats = await bookingModel.aggregate([
      {
        $group: {
          _id: null,
          totalTicketsSold: { $sum: "$numberOfTicket" },
          totalRevenue: {
            $sum: { $multiply: ["$numberOfTicket", "$pricePerTicket"] },
          },
          totalBookingEntries: { $sum: 1 }, // 👈 count of total booking entries
        },
      },
    ]);

    const totalTicketsSold = ticketStats?.[0]?.totalTicketsSold || 0;
    const totalRevenue = ticketStats?.[0]?.totalRevenue || 0;
    const totalBookingEntries = ticketStats?.[0]?.totalBookingEntries || 0;

    const averagePerTicket =
      totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;

    const upcomingEventList = await eventModel
      .find({ startDateTime: { $gt: new Date() } })
      .sort({ startDateTime: 1 })
      .limit(5);

    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Dashboard_Data_Fetched"),
      data: new adminDashboardResponse({
        totalEvents,
        upcomingEvents,
        users: userRoleCounts,
        totalTicketsSold,
        totalRevenue,
        averagePerTicket,
        totalBookingEntries, // 👈 send in response
        upcomingEventList,
      }),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};

//userDashboard

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const language = req.query.language || "en";

    // Total upcoming events
    const now = new Date();
    const upcomingEvents = await eventModel
      .find({ startDateTime: { $gt: now } })
      .sort({ startDateTime: 1 });
    const upcomingEventsCount = upcomingEvents.length;

    // All tickets for the user
    const myTickets = await bookingModel
      .find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

      console.log(myTickets);
    const myTicketsCount = myTickets.length;

    // Next event
    const nextEvent = upcomingEvents[0] || null;

    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Dashboard_Data_Fetched"),
      data: new userDashboardResponse({
        upcomingEventsCount,
        myTicketsCount,
        nextEvent,
        upcomingEvents,
        myTickets,
      }),
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
