class ErrorFunc extends Error{
    constructor(error, status){
        super(error)
        this.status = status
    }
}

export {ErrorFunc}