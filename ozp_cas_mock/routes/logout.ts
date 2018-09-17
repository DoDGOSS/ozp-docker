import { Context } from "koa";

import { TGT_COOKIE_NAME } from "../index";
import { Controller } from "./Controller";
import { TicketService } from "../domain/tickets";


export class LogoutController extends Controller {

    constructor(private ticketService: TicketService) {
        super();
        this.router.get("", this.expireCredentials.bind(this));
        this.router.get("/", this.expireCredentials.bind(this));
    }

    async expireCredentials(ctx: Context) {
        const tgtCookie = ctx.cookies.get(TGT_COOKIE_NAME);
        if (!tgtCookie) {
            ctx.body = ALREADY_LOGGED_OUT;
            return
        }

        const success = this.ticketService.expireTicketGrantingTicket(tgtCookie);

        // TODO: Handle re-direct to service
        if (success) {
            ctx.cookies.set(TGT_COOKIE_NAME);
            ctx.body = LOGGED_OUT;
            return;
        }

        ctx.body = ERROR_LOGGING_OUT;
    }

}

const LOGGED_OUT = `
<html>
<body>
<h1>Logged out</h1>
</body>
</html>
`;

const ALREADY_LOGGED_OUT = `
<html>
<body>
<h1>Already logged out</h1>
</body>
</html>
`;

const ERROR_LOGGING_OUT = `
<html>
<body>
<h1>Error logging out</h1>
</body>
</html>
`;
