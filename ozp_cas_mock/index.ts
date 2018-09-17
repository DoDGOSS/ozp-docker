import * as http from "http";
import { AddressInfo } from "net";

import Koa, { Context } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

import { Problem } from "./errors";
import { Controller } from "./routes/Controller";
import { LoginController } from "./routes/login";
import { ServiceValidateController } from "./routes/serviceValidate";
import { TicketService } from "./domain/tickets";
import { UserRepository, UserService } from "./domain/user";
import { LogoutController } from "./routes/logout";
import Signals = NodeJS.Signals;


const DEFAULT_PORT = 80;

export const TGT_COOKIE_NAME = "CASTGC";

export async function startServer(serverPort: number): Promise<http.Server> {
    const app = new Koa();
    const router = new Router();

    const ticketService = new TicketService();
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const loginController = new LoginController(ticketService, userService);
    const logoutController = new LogoutController(ticketService);
    const serviceValidateController = new ServiceValidateController(ticketService);

    app.use(bodyParser());

    app.use(logRequests);
    app.use(handleErrors);
    app.on('error', logError);

    addControllerRoutes(router, "/cas/login", loginController);
    addControllerRoutes(router, "/cas/logout", logoutController);
    addControllerRoutes(router, "/cas/serviceValidate", serviceValidateController);

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app.listen(serverPort, "0.0.0.0");
}

async function logRequests(ctx: Context, next: () => Promise<any>) {
    let timestamp = new Date().toISOString();
    let start = process.hrtime();

    await next();

    let elapsed = process.hrtime(start);
    let elapsedMs = ((elapsed[0] * 1e3) + (elapsed[1] / 1e6)).toFixed(2);

    console.log(`${timestamp} ${ctx.request.ip} ${ctx.method} ${ctx.originalUrl} ${ctx.status} ${elapsedMs}ms`)
}

async function handleErrors(ctx: Context, next: () => Promise<any>) {
    try {
        await next();
    } catch (err) {
        const status = err.status || 500;

        if (err instanceof Problem) {
            ctx.body = err;
        } else {
            ctx.body = {
                status: status,
                title: "Internal Server Error"
            };
        }
        ctx.status = status;

        ctx.app.emit('error', err, ctx);
    }
}


function logError(error, ctx: Context) {
    console.error(`Error: ${ctx.request.ip} ${ctx.method} ${ctx.originalUrl} ${ctx.status} - ${error.message}`);
    console.dir(error);
}

function addControllerRoutes(router: Router, url: string, controller: Controller) {
    router.use(url, controller.routes(), controller.allowedMethods());
}

const SHUTDOWN_SIGNALS: Signals[] = ["SIGHUP", "SIGINT", "SIGTERM"];

function onServerStart(server: http.Server) {
    let addr = server.address() as AddressInfo;
    console.log(`cas-mock server started; listening at http://${addr.address}:${addr.port}`);

    SHUTDOWN_SIGNALS.forEach(signal => {
        process.on(signal, () => { shutdown(server, signal); })
    });
}

function shutdown(server: http.Server, signal: Signals) {
    console.log(`Received '${signal}' signal; stopping server...`);
    server.close(() => {
        console.log(`Server stopped by signal '${signal}'. Goodbye!`);
        process.exit(0);
    });
}

if (require.main === module) {
    const serverPort = parseInt(process.env.SERVER_PORT) || DEFAULT_PORT;

    startServer(serverPort)
        .then(onServerStart)
        .catch(error => {
            console.error(error)
        })
}
