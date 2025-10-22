import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import  { Request, Response, NextFunction } from 'express';

export function validateRequest(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || typeof req.body !== "object") {
            console.log("Body :", req.body);
            console.log("error is here");
            return res.status(400).json({ errors: ["Invalid or missing request body"] });
        }

        const instance = plainToInstance(dtoClass, req.body);
        const errors = await validate(instance);

        console.log("errors:",errors)

        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            console.log("errors :",messages);
            return res.status(400).json({ errors: messages });
        }

        req.body = instance;
        next();
    };
}

