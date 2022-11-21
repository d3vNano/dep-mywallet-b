import { transactionSchema } from "../models/transaction.schema.js";

function transactionMiddleware(req, res, next) {
    const { type, value, description } = req.body;

    const { error } = transactionSchema.validate({
        type,
        value,
        description,
    });

    if (error) {
        res.sendStatus(400);
        return;
    }

    next();
}

export { transactionMiddleware };
