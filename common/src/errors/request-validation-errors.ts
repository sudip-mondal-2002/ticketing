import { ValidationError } from 'express-validator';
import CustomError from './custom-error';
export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('Error validating request parameters');

        //Because we are extendng built in TS class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        const result = this.errors.map(error => {
            return {
                message: error.msg,
                field: error.param
            }
        })
        return result;
    }
}