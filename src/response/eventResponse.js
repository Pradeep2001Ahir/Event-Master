class eventResponse {
    constructor(instance){
        this.title = instance.title ? instance.title:"",
        this.description = instance.description ? instance.description:"",
        this.venue = instance.venue ? instance.venue:"",
        this.capacity = instance.capacity ? instance.capacity:"",
        this.ticketPrice = instance.ticketPrice ? instance.ticketPrice:"",
        this.startDateTime = instance.startDateTime ? instance.startDateTime:"",
        this.images = instance.images ? instance.images:""
    }
}

export default eventResponse;