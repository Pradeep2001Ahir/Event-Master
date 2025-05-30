import eventModel from "../../model/event.js";
import moment from "moment";

export const getEventById = async (eventId) => {
  try {
    const eventData = await eventModel.findOne({ _id: eventId }).lean();
    return eventData;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFilterEventData = async (
  search,
  page = 1,
  perPage = 10,
  startDate,
  endDate,
  priceSort
) => {
  try {
    const skip = (page - 1) * perPage;
    let filter = {};

    // 🔍 Search by title (optional)
    if (search) {
      filter.title = { $regex: ".*" + search + ".*", $options: "i" };
    }

    // 📅 Filter by date range (optional)
    if (startDate && endDate) {
      const start = moment(startDate, "YYYY-MM-DD").startOf("day");
      const end = moment(endDate, "YYYY-MM-DD").endOf("day");

      filter.startDateTime = {
        $gte: start,
        $lte: end,
      };
    }

    // 💰 Sorting by price (optional)
    let sort = { _id: -1 }; // Default: newest first
    if (priceSort === "asc") sort = { ticketPrice: 1 };
    else if (priceSort === "desc") sort = { ticketPrice: -1 };

    // 🎯 Final query
    const events = await eventModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(perPage);

    return events;
  } catch (error) {
    throw new Error(error.message);
  }
};
