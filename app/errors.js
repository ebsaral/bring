const {
    getResponse
} = require("./utils");

class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getStatusCode() {
        if (this instanceof BadRequest) {
            return 400;
        }
        if (this instanceof NotFound) {
            return 404;
        }
        return 500;
    }

    getInternalCode() {
        // Can be used from constants as well
        if (this instanceof BadRequest) {
            return 1;
        }
        if (this instanceof NotFound) {
            return 2;
        }
        return 3;
    }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}

const handleErrors = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        return res.status(err.getStatusCode()).json(getResponse(err.getInternalCode(), err.message));
    }

    return res.status(500).json(getResponse(3, err.message));
}

module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    handleErrors
};