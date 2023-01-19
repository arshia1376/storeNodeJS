const mongoose = require("mongoose");
const Customer = require("../../model/customerModel");
const {validateCreateCustomer, validateUpdateCustomer} = require("../validators/customerValidator");

module.exports = new (class CustomerController {

    async getMe(req, res) {
        res.send(req.user)
    }

    async customerList(req, res) {
        const customers = await Customer.find();
        res.send(customers)
    }

    async updateCustomer(req, res) {
        const {error} = validateUpdateCustomer({
            ...req.body,
            customerId: req.params.customerId
        })
        if (error)
            return res.status(400).send({massage: error.message});
        let customer = await Customer.findById(req.params.customerId)
        if (!customer)
            return res.status(404).send({massage: error.message});
        customer.name = req.body.name;
        customer = await customer.save();
        res.send(customer)
    }

    async deleteCustomer(req, res) {
        await Customer.findByIdAndRemove(req.params.customerId);
        res.status(200).send("deleted");
    }

    async CreateCustomer(req, res) {
        const {error} = validateCreateCustomer(req.body);
        if (error)
            return res.status(400).send({massage: error.message});
        let customer = new Customer({
            name: req.body.name,
        });
        customer = await customer.save();
        res.send(customer);
    }

    async customerId(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send("bad id");
        }
        const customer = await Customer.findById(req.params.id);
        if (customer)
            res.send(customer);
        else res.status(404).send("not found");
    }

})();

