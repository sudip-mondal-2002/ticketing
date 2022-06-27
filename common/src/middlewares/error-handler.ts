import { Request, Response, NextFunction } from "express";
import CustomError from './../errors/custom-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            errors: err.serializeErrors()
        });
    }
    else {
        return res.status(500).json({
            errors: [{ msg: err.message }]
        })
    }
}
