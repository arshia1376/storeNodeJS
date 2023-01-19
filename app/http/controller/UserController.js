require('express-async-errors');
const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const _ = require("lodash");
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({ apikey: '74484E79614B7A555A62517A733977437A6763774F554655434D6D685A636D41425A7941395559667A6B6F3D' });
const bcrypt = require("bcrypt");
const UserModel = require("../../model/UserModel");
const { loginValidator, registerValidator } = require("../validators/UserValidator");
const myCache = new NodeCache({ stdTTL: 2 * 60 * 60, checkperiod: 5 * 60 });


module.exports = new (class UserController {

    async SendCode(req, res) {
        const id = req.user._id;
        const user = await UserModel.findById(id);
        if (!user) res.status(404).send('همجین کاریری موحود نیست!')
        const number = Math.floor((Math.random() * 90000) + 10000);
        myCache.set(req.user._id, number);
        api.Send({
            message: `کد ورود شما:${number}`,
            sender: "10008663",
            receptor: "09384013730",
        },
            function (response, status) {
                res.status(status).send(response)
                console.log(response);
                console.log(status);
            }
        );
    }

    async VerifyCode(req, res) {
        if (!req.body.code) return res.status(400).send("کدی دریافت نشد");
        const code = req.body.code;
        const lastCode = myCache.get(req.user._id)
        console.log(code, lastCode);
        if (code == lastCode) {
            const user = await UserModel.findById(req.user._id);
            user.active = true;
            await user.save();
            res.status(200).send(true);
        }
        else res.status(400).send(false)
    }

    async Login(req, res) {
        const { error } = loginValidator(req.body);
        if (error) { return res.status(400).send({ message: error.message }) }
        let user = await UserModel.findOne({ phone: req.body.phone })
        if (!user) return res.status(400).send({ message: "کاربری با اتین شماره یا پسوورد ثبت نام نکرده" });
        //مقایسه پسورد وارد شده با پشورد مونگو
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) return res.status(400).send({ message: "کاربری با اتین شماره یا پسوورد ثبت نام نکرده" });
        const data = {
            _id: user._id,
            name: user.name
        };
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).status(200).send({ success: true });
    } 

    async Register(req, res) {
        const { error } = registerValidator(req.body);
        if (error) { return res.status(400).send({ message: error.message }) }
        let user = await UserModel.findOne({ phone: req.body.phone })
        if (user) return res.status(400).send({ message: "این کاربر قبلا ثبت شده" });
        user = new UserModel(_.pick(req.body, ["name", "phone", "password"]));
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        user.password = password;
        user = await user.save();
        const data = {
            _id: user._id,
            name: user.name
        };
        const token = user.generateAuthToken()
        res.header('x-auth-token', token).send(_.pick(user, ["name", "phone", "_id"]))
    }

    async DeleteUser(req, res) {
        await UserModel.findByIdAndRemove(req.params.userId);
        res.status(200).send("deleted");
    }

    async GetUserId(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send("bad id");
        }
        const user = await UserModel.findById(req.params.id);
        if (user)
            res.send(user);
        else res.status(404).send("not found");
    }

    async GetUserAll(req, res) {  
        const user = await UserModel.find();
        res.send(user)
    }

})();

