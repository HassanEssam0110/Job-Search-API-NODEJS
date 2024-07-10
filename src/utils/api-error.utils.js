export class ApiError extends Error {
    constructor(message, statusCode, location, data) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.location = location;
        this.data = data;
    }
}