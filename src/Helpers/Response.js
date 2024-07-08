class Response {
    constructor(type = 'success', message = "", params = {}) {
       
        this.data = params;
        this.type = type;
        this.message = message;

    }

    render() {
        return {
            params: this.data,
            type: this.type,
            message: this.message,
            error: this.type === 'success' ? false : true,
            show: true
        }
    }
   
}

export default Response;
