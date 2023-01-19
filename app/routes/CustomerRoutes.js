const express = require("express")
const router = express.Router();
const Auth = require("../http/middleware/auth");
const Admin = require('../http/middleware/admin');
const CustomerController = require("../http/controller/CustomerController");

router.get("/api/me", Auth, CustomerController.getMe)

router.get("/api/customers", Auth, CustomerController.customerList);

router.put("/api/customers/:customerId", CustomerController.updateCustomer);

router.delete("/api/customers/:customerId", CustomerController.deleteCustomer);

router.post("/api/customers", CustomerController.CreateCustomer);

router.get("/api/customers/:id", [Auth, Admin], CustomerController.customerId);

module.exports = router;