export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

export const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

export const sendCreated = (res, message, data = null) => {
  return sendSuccess(res, message, data, 201);
};

export const sendNoContent = (res) => {
  return res.status(204).send();
};