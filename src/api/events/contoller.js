//NPM
import { validationResult } from "express-validator";
import moment from "moment";
//Model
import eventModel from "../../model/event.js";
import categoryModel from "../../model/categories.js";
//Function
import { getMessage } from "../../helper/common/helper.js";
import eventResponse from "../../response/eventResponse.js";
import { getEventById, getFilterEventData } from "./service.js";

export const createEvent = async (req, res) => {
  try {
    const {
      language = "en",
      title,
      description,
      venue,
      capacity,
      ticketPrice,
      startDateTime,
      categoryId,
      images = []
    } = req.body;

    const eventDate = moment(startDateTime, "YYYY-MM-DD HH:mm", true);

    if (!eventDate.isValid()) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, "Invalid_Start_DateTime"),
      });
    }

    // 👇 Directly use formatted string for saving
    const formattedStartDate = eventDate.toDate();

    const userId = req.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    const category = await categoryModel.findOne({ _id: categoryId }).lean();
    if (!category) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language, "Category_Not_Found"),
      });
    }

    const eventObj = new eventModel({
      userId,
      categoryId,
      title,
      description,
      venue,
      capacity,
      ticketPrice,
      startDateTime: formattedStartDate,
      images
    });

    const eventSave = await eventObj.save();

    if (eventSave) {
      return res.status(200).send({
        status: true,
        message: await getMessage(language, "Event_Create_Scuccess"),
      });
    }

    return res.send({
      status: false,
      message: await getMessage(language, "Feild_To_Create_Event"),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};

//Edit event
export const editEvent = async (req, res) => {
  try {
    const {
      language = "en",
      title,
      description,
      venue,
      capacity,
      ticketPrice,
      startDateTime,
    } = req.body;
    const { id } = req.params;
    const eventDate = moment(startDateTime, "YYYY-MM-DD HH:mm", true);

    if (!eventDate.isValid()) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, "Invalid_Start_DateTime"),
      });
    }

    // 👇 Directly use formatted string for saving
    const formattedStartDate = eventDate.toDate();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    const updateEvent = await eventModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          venue,
          capacity,
          ticketPrice,
          startDateTime: formattedStartDate,
        },
      },
      { new: true }
    );

    if (!updateEvent) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language, "Feild_To_Update_Event"),
      });
    }
    return res.status(200).send({
      status: true,
      message: await getMessage(language, "Event_Update_Success"),
      data: new eventResponse(updateEvent),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};

//get evemt details

export const getEventDetails = async (req, res) => {
  try {
    const { id: eventId } = req.params; // Correct
    const language = req.query.language || "en";
    const getEventData = await getEventById(eventId);

    if (getEventData) {
      return res.status(200).send({
        status: 200,
        message: await getMessage(language, "Get_Event_Details_Success"),
        data: new eventResponse(getEventData),
      });
    }

    return res.send({
      status: false,
      message: await getMessage(language, "Data_Not_Found"),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};


// get all event list with filter
export const getFilterEventList = async (req, res) => {
  try {
    const {
      language = "en",
      search,
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      priceSort,
      categoryId
    } = req.body;

    const {event,totalCount} = await getFilterEventData(
      search,
      page,
      perPage,
      startDate,
      endDate,
      priceSort,
      categoryId
    );

    
      const response = await Promise.all(
        event.map((eventItem) => new eventResponse(eventItem))
      );

      return res.status(200).send({
        status: true,
        message: await getMessage(language, "Event_List_Fetched_Success"),
        totalCount,
        data: response,  // if no event found it will return empty []
      });
     
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};




