export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    (<any>this).statusCode = statusCode;
    (<any>this).status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    (<any>this).isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleDuplicateFieldsDB = (err) => {
  console.log(err);
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

export const sendErrorProd = (err, req, res, next) => {
  // Operational, trusted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error
  } else {
    // 1) Log error
    console.error("ERROR 💥: ", err);

    // 2) Send generic message
    res.status(500).send({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export const AppErrorToResponse = (err) => {
  let error = { ...err };
  // Object.assign(error,err)
  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  }
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  }
  return error;
};

// export {AppError,AppErrorToResponse,sendErrorProd};
