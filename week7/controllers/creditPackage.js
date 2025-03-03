const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const creditPackage = {
  get: catchAsync(async (req, res, next) => {
    const data = await dataSource.getRepository("CREDIT_PACKAGE").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    successResponse(res, data);
  }),
  createPackage: catchAsync(),
  buyPackage: catchAsync(),
  delete: catchAsync(),
};

module.exports = {
  creditPackage,
};
