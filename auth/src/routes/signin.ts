import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from '@tickeing-sm/common';
import { BadRequestError } from '@tickeing-sm/common';
import { DatabaseConnectionError } from '@tickeing-sm/common';

import { User } from "../models/user";

import { Password } from './../services/password';
import JWT from 'jsonwebtoken';

const router = Router();
router.post('/api/users/signin', [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must not be empty")
],
validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;
    let user;
    try{
        user = await User.findOne({email}).exec();
    } catch (err) {
        throw new DatabaseConnectionError()
    }
    if(!user){
        throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch = await Password.compare(password, user.password);
    if(!passwordMatch){
        throw new BadRequestError('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = JWT.sign({id: user.id, email: user.email}, process.env.JWT_KEY!);

    req.session = {
        ...req.session,
        jwt: token,
    };
    res.status(200).json(user);
})

export default router;