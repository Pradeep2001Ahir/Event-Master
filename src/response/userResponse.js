import dotenv from 'dotenv';
dotenv.config();

class userResponse  {
    constructor(instance){
        this.userName = instance.userName ? instance.userName:"",
        this.email = instance.email ? instance.email: "",
        this.userRole = instance.userRole ? instance.userRole: "",
        this.createdAt = instance.createdAt ? instance.createdAt: "",
       this.profileImage = instance.profileImage ? process.env.IMAGE_ACCESS_URL + instance.profileImage : '';


    }
}

export default userResponse;