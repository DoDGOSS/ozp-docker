import { Context } from "koa";

import { Controller } from "./Controller";
import { TicketService } from "../domain/tickets";
import { User } from "../domain/user";


export class ServiceValidateController extends Controller {

    constructor(private ticketService: TicketService) {
        super();
        this.router.get("/", this.validateServiceTicket.bind(this));
    }

    async validateServiceTicket(ctx: Context) {
        const serviceTicketId = ctx.query['ticket'] as string;
        const serviceTicket = this.ticketService.findServiceTicket(serviceTicketId);

        ctx.type = "text/xml";
        if (!serviceTicket) {
            ctx.body = invalidTicketResponse(serviceTicketId);
        } else {
            ctx.body = validTicketResponse(serviceTicket.user);
        }
    }

}

function validTicketResponse(user: User): string {
    return `
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationSuccess>
    <cas:user>${user.username}</cas:user>
    <cas:attributes>
    </cas:attributes>
  </cas:authenticationSuccess>
</cas:serviceResponse>`;
}

function invalidTicketResponse(serviceTicketId: string): string {
    return authenticationFailure("INVALID_TICKET", `ticket ${serviceTicketId} not recognized`)
}

function authenticationFailure(code: string, message: string): string {
    return `
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationFailure code="${code}">${message}</cas:authenticationFailure>
</cas:serviceResponse>`;

}
