import { URL } from "url";
import * as querystring from "querystring";

import { Context } from "koa";
import Ajv from "ajv";

import { TGT_COOKIE_NAME } from "../index";
import { ValidationError } from "../errors";
import { Controller } from "./Controller";
import { TicketService } from "../domain/tickets";
import { UserService } from "../domain/user";


export interface LoginRequest {
    username: string;
    password: string
}

export class LoginController extends Controller {

    constructor(private ticketService: TicketService,
                private userService: UserService) {
        super();
        this.router.get("/", this.requestCredentials.bind(this));
        this.router.post("/", this.acceptCredentials.bind(this));
    }

    async requestCredentials(ctx: Context) {
        const tgtCookie = ctx.cookies.get(TGT_COOKIE_NAME);
        const serviceTicketId = this.ticketService.findServiceTicketId(tgtCookie);
        if (serviceTicketId) {
            const service = ctx.query.service;
            const serviceUrl = new URL(service);

            let searchQs = serviceUrl.search;
            if (searchQs.startsWith("?")) {
                searchQs = searchQs.substring(1);
            }

            const serviceQs = querystring.parse(searchQs);
            serviceQs.ticket = `ST-${serviceTicketId}`;
            serviceUrl.search = querystring.stringify(serviceQs);

            return ctx.redirect(serviceUrl.toString());
        }

        ctx.body = LOGIN_FORM;
    }

    async acceptCredentials(ctx: Context) {
        let loginRequest = validateLoginRequest(ctx.request.body);
        let user = this.userService.authenticate(loginRequest.username, loginRequest.password);

        let serviceTicketId = this.ticketService.createServiceTicket(user);
        let ticketGrantingTicketId = this.ticketService.createTicketGrantingTicket(serviceTicketId);

        const service = ctx.query['service'] as string;  // TODO: validate
        ctx.cookies.set(TGT_COOKIE_NAME, `TGT-${ticketGrantingTicketId}`);
        return ctx.redirect(`/cas/login?service=${service}`);
    }

}

const ajv = new Ajv({ allErrors: true });

const LOGIN_REQUEST_SCHEMA = {
    type: "object",
    properties: {
        username: {
            type: "string"
        },
        password: {
            type: "string"
        }
    },
    required: ["username", "password"]
};

const LOGIN_FORM = `
<html>
<body>
<form method="post" action="">
    <input name="username" type="text" />
    <input name="password" type="password" />
    <input type="submit" />
</form>
</body>
</html>
`;

const _validateLoginRequest = ajv.compile(LOGIN_REQUEST_SCHEMA);

function validateLoginRequest(data: any): LoginRequest {
    let valid = _validateLoginRequest(data);
    if (!valid) {
        throw new ValidationError("Invalid login request", _validateLoginRequest.errors);
    }
    return data;
}
