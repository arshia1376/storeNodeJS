const mongoose = require("mongoose");
const schema = new mongoose.Schema({ name: String });
const CustomerModel = mongoose.model("customer", schema);
module.exports = CustomerModel;