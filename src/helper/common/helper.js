import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { languageSupport } from './constant.js';
import MESSAGE_DATA from '../language/english.js';

export const createJwtToken = async(data) => {
    try{
         const token =  jwt.sign(data, process.env.JWT_SECRET , {expiresIn:"1d"});
         return token;
    }
    catch(error){
        throw new Error(error.message)
    }
}


//message of user modle

export const getMessage = async(language, message) => {
    if(language == languageSupport.english){
        const englishMessage = await MESSAGE_DATA[message];
        return englishMessage;
    } else {
        const otherMessage = await MESSAGE_DATA[message];
        return  otherMessage;
    }
}