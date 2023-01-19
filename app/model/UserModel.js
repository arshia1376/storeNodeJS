const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, minlength: 11, max_length: 11 },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    active: { type: Boolean, default: false }
});
schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        name: this.name,
        role: this.role,
    };
    return jwt.sign(data, config.get('jwtPrivateKey'));
};
const UserModel = mongoose.model("User", schema);
module.exports = UserModel;