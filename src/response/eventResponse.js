import dotenv from 'dotenv';
dotenv.config();

class eventResponse {
    constructor(instance){
        this.title = instance.title ? instance.title:"",
        this.description = instance.description ? instance.description:"",
        this.venue = instance.venue ? instance.venue:"",
        this.capacity = instance.capacity ? instance.capacity:0,
        this.ticketPrice = instance.ticketPrice ? instance.ticketPrice:0,
        this.startDateTime = instance.startDateTime ? instance.startDateTime:"",
        this.createdAt = instance.createdAt ? instance.createdAt:""
       this.images = Array.isArray(instance.images)
        ? instance.images.map(img => process.env.IMAGE_ACCESS_URL + img)
        : [];

    }
}

export default eventResponse;