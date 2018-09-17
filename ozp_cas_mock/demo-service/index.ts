import * as querystring from "querystring";

import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

import * as request from "request-promise-native"
import * as xml2js from "xml2js";

const app = new Koa();
const router = new Router();

const CAS_LOGIN_URL = "http://localhost:8081/cas/login";
const CAS_VALIDATE_URL = "http://localhost:8081/cas/serviceValidate";

const SERVICE_PORT = 8080;
const SERVICE_ID = `http://localhost:${SERVICE_PORT}`;


app.use(bodyParser());

router.get("/", async ctx => {
    console.log("GET /");

    const ticket = ctx.query['ticket'];
    if (ticket) {
        return handleAuthenticationTicket(ctx, ticket);
    }

    const cookie = ctx.cookies.get("JSESSIONID");
    if (!cookie) {
        return redirectToLogin(ctx);
    }

    console.log("has cookie");
    console.dir(cookie);

    ctx.body = "Hello World";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(SERVICE_PORT);

console.log(`demo-service running on port ${SERVICE_PORT}`);

async function handleAuthenticationTicket(ctx, ticket) {
    console.log("has ticket");

    let response = await request.get(`${CAS_VALIDATE_URL}/?service=${SERVICE_ID}&ticket=${ticket}`);
    let responseJs = await parseXml(response);

    let serviceResponse = responseJs["cas:serviceResponse"];
    if (!serviceResponse) {
        ctx.status = 500;
        return;
    }

    let authenticationSuccess = serviceResponse["cas:authenticationSuccess"];
    if (!authenticationSuccess) {
        return redirectToLogin(ctx);
    }

    console.dir(authenticationSuccess, { depth: null });
    let username = authenticationSuccess[0]["cas:user"][0];
    console.log(`user '${username}' logged in`);

    // Issue session cookie
    ctx.cookies.set("JSESSIONID", "123456789");

    ctx.redirect("http://localhost:8080/");
}

async function redirectToLogin(ctx) {
    const qs = querystring.stringify({
        service: SERVICE_ID
    });
    ctx.redirect(`${CAS_LOGIN_URL}?${qs}`);
}

function parseXml(value: string): Promise<any> {
    return new Promise((resolve, reject) => {
        xml2js.parseString(value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}
