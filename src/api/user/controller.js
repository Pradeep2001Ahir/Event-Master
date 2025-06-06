//NPM
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
//Models
import userModel from "../../model/user.js";
//Response
import userResponse from "../../response/userResponse.js";
//Functions
import { emailExists, getUserByEmail, getUserById } from "./service.js";
import { createJwtToken ,getMessage} from "../../helper/common/helper.js";
import { userRole as roles } from "../../helper/common/constant.js";
import mongoose from "mongoose";
import logger from "../../helper/common/logger.js";
// import { emit } from "process";


//user register
export const userRegister = async (req, res) => {
  try {

    console.log("📦 req.body =", req.body);
    const { language = "en" ,userName, email, password, userRole } = req.body;

    const errors = validationResult(req);

   if (!errors.isEmpty()) {
  return res.status(400).send({
    status: false,
    message: await getMessage(language, errors.array()[0].msg),
  });
}



      // ✅ Add role validation here
   if (!Object.values(roles).includes(userRole)) {
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
    console.log("📨 Login API hit:", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
  return res.status(400).send({
    status: false,
    message: await getMessage(language, errors.array()[0]["msg"]),
  });
}


    const checkUser = await getUserByEmail(email.toLowerCase());

    console.log("👤 Fetched user:", checkUser);


    if (!checkUser) {
      return res.status(404).send({
        status: false,
        message: await getMessage(language,"User_Does_Not_Exist"),
      });
    }

    console.log("🔐 Checking password match...");

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

    logger.info("User details api ===>>>", + JSON.stringify(getUserData));

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
        const {language="en", userName,profileImage} = req.body;
         const  userId = req.user.id;
        
        const getUserData = await getUserById(userId);

        if(getUserData){
             //update user data
             const updateData = await userModel.findOneAndUpdate(
              {_id: new mongoose.Types.ObjectId(userId)},
              {
                $set:{
                  userName, 
                  ...(profileImage && {profileImage}),
                }
              },
              {new:true}
             );

             return res.status(200).send({
              status:true,
              message: await getMessage(language, "Update_User_Details"),
              data:new userResponse(updateData)
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


// //profileImage
// export const uploadProfileImage = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     if (!req.file) {
//       return res.status(400).json({
//         status: false,
//         message: "No file uploaded",
//       });
//     }

  

//     // Step 1: Get user from DB
//     const user = await userModel.findById(userId);

//     // Step 2: Delete previous image if exists
//     if (user?.profileImage) {
//       const oldImagePath = path.resolve(user.profileImage); // absolute path

//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//         console.log("🧹 Deleted old image:", oldImagePath);
//       } else {
//         console.log("⚠ Old image not found:", oldImagePath);
//       }
//     }

//     // Step 3: Store new image path (standardized)
//     const newImagePath = req.file.path.replace(/\\/g, "/");

//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { profileImage: newImagePath },
//       { new: true }
//     );

//     return res.status(200).json({
//       status: true,
//       message: "Profile image updated successfully",
//       data: new userResponse(updatedUser),
//     });
//   } catch (error) {
//     console.error("❌ Image upload error:", error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };






//forget password

export const forgotPassword = async(req, res) => {
  try{
        const {email, language="en"} = req.body;
        
        const user = await getUserByEmail(email.toLowerCase());

        if(!user){
          return res.status(404).send({
            status:false,
            message :await getMessage(language, "User_Does_Not_Exist")
          })
        }

        //genrate token

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 1000 * 60 *15;

        console.log(token);
        //save token in db
        await userModel.findByIdAndUpdate(user._id,{
          resetPasswordToken : token,
          resetPasswordExpires : tokenExpiry
        })

        //send email with reset link
        const resetLink = `http://localhost:5173/reset-password/$(token)`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth : {
            user : process.env.MY_EMAIL,
            pass :  process.env.PASSWORD
          }
        })

        await transporter.sendMail({
          from : process.env.MY_EMAIL,//shift this to .env
          to : email,
          subject : "Password Reset",
          html : `<P><a href="${resetLink}">here</a> to reset your password. This link will be exprie in 15 minutes.</P>`
        })

        return res.status(200).send({
          status:true,
          message: await getMessage(language, "Reset_Link_Sent"),
          token:token
        })

  }
  catch(error){
    return res.send({
      status:false,
      message:error.message
    })
  }
}


//Reset password API

export const resetPassword = async(req, res) => {
  try{
    const {token, newPassword, language="en"} = req.body;

    const user = await userModel.findOne({
      resetPasswordToken : token,
      resetPasswordExpires : {$gt: Date.now()}
    });

    if(!user){
      return res.status(400).send({
        status:false,
        message: await getMessage(language, "Invalid_Or_Expired_Token")
      })
    }

    user.password = bcrypt.hashSync(newPassword,10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).send({
      status:true,
      message: await getMessage(language, "Password_Reset_Success")
    })
  }
  catch(error){
    return res.send({
      status:false,
      message : error.message
    })
  }
}
