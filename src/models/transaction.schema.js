import joi from "joi";

const transactionSchema = joi.object({
    type: joi.string().valid("entry", "exit").required(),
    value: joi.number().required(),
    description: joi.string().required(),
});

export { transactionSchema };
