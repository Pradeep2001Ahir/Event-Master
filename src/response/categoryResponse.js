class categoryResponse {
    constructor(instance){
        this.name = instance.name ? instance.name:"",
        this.createdAt = instance.createdAt ? instance.createdAt:""

    }
}

export default categoryResponse;