import { ErrorObject } from "ajv";

import { HttpStatus } from "./status";


export class Problem extends Error {

    constructor(readonly title: string,
                readonly status: number,
                message: string) {
        super(message);
    }

    toJSON(): any {
        return {
            status: this.status,
            title: this.title,
            message: this.message
        }
    }

}

export class BadRequest extends Problem {

    constructor(message: string) {
        super("Bad Request", HttpStatus.BadRequest, message);
    }

}


export class ValidationError extends Problem {

    constructor(message: string, readonly errors: Array<ErrorObject>) {
        super("Validation Error", HttpStatus.BadRequest, message);
    }

    toJSON() {
        const result = super.toJSON();
        result.validationErrors = this.errors;
        return result;
    }

}

export class Unauthorized extends Problem {

    constructor(message: string) {
        super("Unauthorized", HttpStatus.Unauthorized, message);
    }

}

export class NotFound extends Problem {

    constructor(message: string) {
        super("Not Found", HttpStatus.NotFound, message);
    }

}
