import mongoose from "mongoose";
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
  priceSort,
  categoryId
) => {
  try {
    const skip = (page - 1) * perPage;
    let filter = {};

    // 🔍 Search by title (optional)
    if (search) {
      filter.title = { $regex: ".*" + search + ".*", $options: "i" };
    }

    // 📅 Filter by date range (optional)
    if (startDate || endDate) {
      filter.startDateTime = {}
         
       if(startDate){
        const start = moment(startDate, "YYYY-MM-DD").startOf("day");
        filter.startDateTime.$gte = start;
       }

       if(endDate){
        const end = moment(endDate, "YYYY-MM-DD").endOf("day");
        filter.startDateTime.$lte = end;
       }
    }

    //filter by category
    if(categoryId && Array.isArray(categoryId) && categoryId.length> 0){
      filter.categoryId = {
        $in : categoryId.map((id) => new mongoose.Types.ObjectId(id),)
      }
    }

    // 💰 Sorting by price (optional)
    let sort = {createdAt: -1 }; // Default: newest first
    if (priceSort === "asc") sort = { ticketPrice: 1 };
    else if (priceSort === "desc") sort = { ticketPrice: -1 };

    // 🎯 Final query
    // const events = await eventModel.find(filter)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(perPage);
    // return events;

    const [event, totalCount] = await Promise.all([
      eventModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(perPage),

      eventModel.countDocuments(filter)
    ]);

    return {event, totalCount};

  } catch (error) {
    throw new Error(error.message);
  }
};
