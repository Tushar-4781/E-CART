const express = require("express");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const translateRoute = require("./translate.route");

const router = express.Router();

router.use("/users",userRoute)
router.use("/auth",authRoute);
router.use("/translate",translateRoute)

router.use("/products", productRoute);
router.use("/cart", cartRoute);

module.exports = router;
