import { Router, Request, Response } from "express";

import { body } from "express-validator";

import { validateRequest } from "@tickeing-sm/common";
import { DatabaseConnectionError } from "@tickeing-sm/common";
import { BadRequestError } from '@tickeing-sm/common';

import { User } from "../models/user";

import JWT from "jsonwebtoken";

const router = Router();
router.post("/api/users/signup", [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters")
],
validateRequest, 
async (req: Request, res: Response) => {
    let existingUser;
    const { email, password } = req.body;
    try {
        existingUser = await User.findOne({ email }).exec();
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    if (existingUser) {
        throw new BadRequestError("User already exists");
    }

    try {
        const user = User.build({ email, password });
        await user.save();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const token = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

        req.session = {
            ...req.session,
            jwt: token,
        };
        res.status(201).json(user);
    } catch (err) {
        throw new DatabaseConnectionError();
    }

})

export default router;