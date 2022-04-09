const catchAsync = require("../utils/catchAsync");
const { translateService } = require("../services");

const TNR = catchAsync(async (req, res) => {
    const a = await translateService.translator(req.body.sent)
    res.status(200).send({"translated_text":a}); 
});
module.exports = {
    TNR,
  }