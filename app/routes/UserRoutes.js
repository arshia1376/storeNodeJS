const express = require("express")
const router = express.Router();
require('express-async-errors');
const _ = require("lodash");
const Auth = require("../http/middleware/auth");
const UserController=require("../http/controller/UserController")


router.get("/api/users/sendCode", Auth, UserController.SendCode);

router.post("/api/users/verifyCode", Auth, UserController.VerifyCode);

router.post("/api/users/login", UserController.Login);

router.post("/api/users/register", UserController.Register);

router.delete("/api/users/:userId", UserController.DeleteUser);

router.get("/api/user/:id", UserController.GetUserId);

router.get("/api/users", UserController.GetUserAll);   


module.exports = router;