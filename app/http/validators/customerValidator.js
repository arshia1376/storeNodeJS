const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validateCreateCustomer = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required()
    });
    return schema.validate(data);
};
const validateUpdateCustomer = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
        customerId: Joi.objectId().required()
    });
    return schema.validate(data);
};
module.exports = { validateCreateCustomer, validateUpdateCustomer };