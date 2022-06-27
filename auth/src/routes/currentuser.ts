import { Router, Request, Response } from "express";
import { currentUser } from '@tickeing-sm/common';
const router = Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
    res.json({
        currentUser: req.currentUser || null
    })
});

export default router;