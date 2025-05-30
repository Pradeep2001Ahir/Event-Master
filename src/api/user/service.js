import userModel from "../../model/user.js";

export const emailExists = async(email) => {
    try{
          const getUserData = await userModel.findOne({email:email}).lean();

          if(getUserData){
            return true;
          }
          return false;
    }
    catch(error){
        throw new Error(error.message)
    }
}


export const getUserByEmail = async(email) => {
    try{
          const getUser = await userModel.findOne({email:email});
          return getUser;
    }
    catch(error){
        throw new Error(error.message)
    }
}


export const getUserById = async(id) =>{
    try{
         const getUser = await userModel.findOne({_id:id}).lean();
         return getUser;
    }
    catch(error){
        throw new Error(error.message)
    }
}