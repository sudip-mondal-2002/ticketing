import {Request, Response, NextFunction} from 'express';
import {RequestValidationError} from '../errors/request-validation-errors';
import {validationResult} from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        throw new RequestValidationError(error.array());
    }
    next();
}
