//Model

import userModel from "../../model/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({}, "userName email userRole createdAt")
      .sort({ createdAt: -1 });

    res.status(200).send({
      status: true,
      message: "user list featche successfully",
      data: users,
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};

// update user role

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    role = role?.toLowerCase();
    // // Only admin can update roles
    // if (req.user.userRole !== "admin") {
    //   return res.status(403).send({
    //     status: false,
    //     message: "Access denied. Only admin can update user roles.",
    //   });
    // }

    // const validRoles = ["user", "organizer", "admin"];

    // if (!validRoles.includes(role)) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Inavalid user role",
    //   });
    // }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { userRole: role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      status: true,
      message: "User role Updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};
