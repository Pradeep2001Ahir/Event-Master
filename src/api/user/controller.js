//NPM
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";

//Models
import userModel from "../../model/user.js";
//Response
import userResponse from "../../response/userResponse.js";
//Functions
import { emailExists, getUserByEmail, getUserById } from "./service.js";
import { createJwtToken ,getMessage} from "../../helper/common/helper.js";
import { userRole as roles } from "../../helper/common/constant.js";
import mongoose from "mongoose";

//user register
export const userRegister = async (req, res) => {
  try {
    const { language = "en" ,userName, email, password, userRole } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }


      // ✅ Add role validation here
    if (!Object.keys(roles).includes(userRole)) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, "Invalid_User_Role"),
      });
    }


    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return res.send({
        status: false,
        message: await getMessage(language, "Invalid_Email_Address"),
      });
    }

    const lowerEamil = email.toLowerCase();

    const checkEmail = await emailExists(lowerEamil);

    if (checkEmail) {
      return res.send({
        status: false,
        message: await getMessage(language,"Email_Already_Exist"),
      });
    }

    const userObj = new userModel({
      userName: userName,
      email: email,
      password: bcrypt.hashSync(password, 10),
      userRole
    });

    const userSave = await userObj.save();

    if (userSave) {
      return res.status(200).send({
        status: true,
        message: await getMessage(language, "User_Register_Success"),
      });
    }

    return res.send({
      status: false,
      message: await getMessage(language, "Feild_To_Register_User"),
    });
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
    });
  }
};

//user Login

export const userLogin = async (req, res) => {
  try {
    const {language, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, errors.error[0]["msg"]),
      });
    }

    const checkUser = await getUserByEmail(email.toLowerCase());

    if (!checkUser) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language,"User_Does_Not_Exist"),
      });
    }

    if (bcrypt.compareSync(password, checkUser.password)) {
      const token = await createJwtToken({ id: checkUser._id });

      return res.status(200).send({
        status: true,
        message: await getMessage(language, "User_Login_Success"),
        token: token,
        data: new userResponse(checkUser),
      });
    }
    else{
        return res.status(400).send({
            status:false,
            message: await getMessage(language, "Invalid_Email_Password")
        })
    }
  } catch (error) {

    return res.send({
      status: false,
      message: error.message,
    });
  }
};

//get userDetails

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const language = req.query.language;

    const getUserData = await getUserById(userId);

    if (getUserData) {
      return res.send({
        status: true,
        message: await getMessage(language, "Get_User_Details_Success"),
        data: new userResponse(getUserData),
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

//EditProfile
export const editProfile = async(req, res) => {
  try{
        const {language="en", userName} = req.body;
         const  userId = req.user.id;
        
        const getUserData = await getUserById(userId);

        if(getUserData){
             //update user data
             const updateData = await userModel.findOneAndUpdate(
              {_id: new mongoose.Types.ObjectId(userId)},
              {
                $set:{userName}
              },
              {new:true}
             );

             return res.status(200).send({
              status:true,
              message: await getMessage(language, "Update_User_Details"),
              data:new userResponse(getUserData)
             })
        }else{
          return res.send({
            status:false,
            message: await getMessage(language, "Field_Update_User_Details")
          })
        }
  }
  catch(error){
    return res.send({
      status:false,
      message:error.message
    })
  }
}

// change password

export const changePassword = async (req, res) => {
  try {
    const { language,oldPassword, newPassword } = req.body;

    const userId = req.user.id;

    const userdata = await getUserById(userId);

    if (!userdata) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language,"User_Not_Found"),
      });
    }

    //check if old password is correct
    const isMatch = bcrypt.compareSync(oldPassword, userdata.password);
    if (!isMatch) {
      return res.status(400).send({
        status: false,
        message: await getMessage(language, "Old_Password_Incorrect"),
      });
    }

    //update new passwrod in DB
    await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          password: bcrypt.hashSync(newPassword, 10),
        },
      }
    );
    res.status(200).send({
      status: true,
      message: await getMessage(language, "Password_Chnage_Success"),
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};


//profileImage
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    const IMAGE_UPLOAD_DIR = "assets/profileImage";

    // Step 1: Get user from DB
    const user = await userModel.findById(userId);

    // Step 2: Delete previous image if exists
    if (user?.profileImage) {
      const oldImagePath = path.resolve(user.profileImage); // absolute path

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("🧹 Deleted old image:", oldImagePath);
      } else {
        console.log("⚠ Old image not found:", oldImagePath);
      }
    }

    // Step 3: Store new image path (standardized)
    const newImagePath = req.file.path.replace(/\\/g, "/");

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profileImage: newImagePath },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Profile image updated successfully",
      data: new userResponse(updatedUser),
    });
  } catch (error) {
    console.error("❌ Image upload error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
