import uuid from "uuid/v4";

import { User } from "./user";


export interface ServiceTicket {
    user: User;
}


export interface TicketGrantingTicket {
    serviceTicketId: string;
}


export class TicketService {

    private serviceTickets: { [id: string]: ServiceTicket } = {};
    private ticketGrantingTickets: { [id: string]: TicketGrantingTicket } = {};

    createServiceTicket(user: User): string {
        let ticketId = uuid();

        this.serviceTickets[ticketId] = {
            user: user
        };

        return ticketId;
    }

    createTicketGrantingTicket(serviceTicketId: string): string {
        let ticketId = uuid();

        this.ticketGrantingTickets[ticketId] = {
            serviceTicketId: serviceTicketId
        };

        return ticketId;
    }

    findServiceTicket(stCookie: string): ServiceTicket | null {
        if (!stCookie || !stCookie.startsWith("ST-")) {
            return null;
        }

        const id = stCookie.substring(3);
        return this.serviceTickets[id];
    }

    expireTicketGrantingTicket(tgtCookie: string): boolean {
        if (!tgtCookie || !tgtCookie.startsWith("TGT-")) {
            return false;
        }

        const tgtId = tgtCookie.substring(4);
        const tgt = this.ticketGrantingTickets[tgtId];

        if (!tgt) {
            return false;
        }

        this.ticketGrantingTickets[tgtId] = null;
        return true
    }

    findServiceTicketId(tgtCookie: string): string | null {
        if (!tgtCookie || !tgtCookie.startsWith("TGT-")) {
            return null;
        }

        const tgtId = tgtCookie.substring(4);
        const tgt = this.ticketGrantingTickets[tgtId];

        if (!tgt) {
            return null;
        }

        return tgt.serviceTicketId;
    }

}
