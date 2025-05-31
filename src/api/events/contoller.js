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

// event listing

//  export const getEventList = async(req, res) => {
//   try{
//         const {language="en", search, page=1, perPage=10} = req.body;

//         const pageNo= (page-1) * perPage;

//         let filter= {};

//         if(search){
//           const reg = {
//             title : {$regex: ".*" + search + ".*", $options:"i"}
//           }

//           filter = Object.assign(filter, reg);
//         }

//         const getAllEvent  = await eventModel.find(filter)
//         .sort({_id:-1})
//         .skip({pageNo})
//         .limit({perPage});

//         if(getAllEvent && getAllEvent.length) {
//           const madeEventResponse = await Promise.all(getAllEvent.map(async (event) => {
//             return new eventResponse(event);
//           }))
           
//          const totalCount = await eventModel.countDocument(filter);
//      
//           return res.status(200).send({
//             status:true,
//             message: await getMessage(language, "Event_List_Fetched_Success"),
//             totalCount: totalCount,     
//             data:madeEventResponse
//           })
//         }
//         else{
//           return res.send({
//             status:false,
//             message: await getMessage(language, "Feild_To_Fetched_Event_List"),
//             data:[]
//           })
//         }

//   }
//   catch(error){
//     return res.send({
//       status:false,
//       message: error.message
//     })
//   }
//  }

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




export const uploadEventImagesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id; // ✅ FIXED

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No images uploaded",
      });
    }

  
    const imagePaths = req.files.map((file) => file.path.replace(/\\/g, "/"));

    const event = await eventModel.findByIdAndUpdate(
      eventId,
      { $push: { images: { $each: imagePaths } } },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Event images uploaded successfully",
      data: new eventResponse(event),
    });
  } catch (error) {
     console.error("❌ Upload error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
