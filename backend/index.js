const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { loadRoutes } = require("./lib/routes");
const { getCollection } = require("./lib/collection");

const app = new Koa();
const router = new Router();
const port = 3000;

main().catch(error => {
  console.error(error);
  process.exit(1);
});

// async function errorCatcher(ctx, next) {
//   try {
//     await next();
//   } catch (error) {
//     if (error instanceof TypeError) {
//       ctx.response.status = 400;
//       ctx.body = error.message;
//     }
//   }
// }

async function main() {
  const collection = await getCollection();
  loadRoutes(router, collection);

  app
    .use(cors())
    .use(bodyParser())
    // .use(errorCatcher)
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`Chanchi app listening on port ${port}!`);
  });
}
