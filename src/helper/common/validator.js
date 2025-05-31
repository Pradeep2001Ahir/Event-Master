import { body } from "express-validator";

export const validator = (method) => {
  switch (method) {
    case "registerValidation": {
      return [
        body("userName", "Username_is_Required").not().notEmpty(),
        body("email", "Email_is_Requird").not().notEmpty(),
        body("password", "Password_is_Required").not().notEmpty(),
        body("userRole", "User_Role_is_Reqiurd").not().notEmpty(),
      ];
    }

    case "evnetRegisterValidation": {
      return [
        body("title", "Title_is_Required").not().notEmpty(),
        body("description", "Description_is_Required").not().notEmpty(),
        body("venue", "Venue_is_Required").not().notEmpty(),
        body("capacity", "Capacity_is_Required").not().notEmpty(),
        body("ticketPrice", "TicketPrice_is_Required").not().notEmpty(),
        body("startDateTime", "StartDateTime_is_Required").not().notEmpty(),
      ];
    }

     case "editEventValidation": {
      return [
        body("title", "Title_is_Required").notEmpty(),
        body("description", "Description_is_Required").notEmpty(),
        body("venue", "Venue_is_Required").notEmpty(),
        body("capacity", "Capacity_is_Required").notEmpty().isInt().withMessage("Capacity_Must_Be_Number"),
        body("ticketPrice", "TicketPrice_is_Required").notEmpty().isFloat().withMessage("TicketPrice_Must_Be_Number"),
        body("startDateTime", "StartDateTime_is_Required").notEmpty(),
      ];
     }
    default:
      return "Something went Wrong";
      break;
  }
};
