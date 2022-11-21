import chalk from "chalk";
import {
    sessionsCollection,
    usersCollection,
} from "../database/collections.js";

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        const user = await usersCollection.findOne({
            _id: session.userId,
        });

        if (!user) {
            res.sendStatus(401);
            return;
        }

        res.locals.session = session;
        res.locals.user = user;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }

    next();
}

export { authMiddleware };
