import { Middleware } from "koa";
import Router from "koa-router";


export class Controller {

    protected readonly router = new Router();

    routes(): Middleware {
        return this.router.routes();
    }

    allowedMethods(): Middleware {
        return this.router.allowedMethods();
    }

}
