const { ObjectID } = require("mongodb");

function loadRoutes(router, collection) {
  router.get("/todos", async ctx => {
    const todos = await collection.find().toArray();
    ctx.body = todos;
  });

  router.get("/todos/:id", async ctx => {
    const todo = await collection.findOne({
      _id: ctx.params.id
    });
    if (todo) {
      ctx.response.status = 200;
      ctx.body = todo;
    } else {
      ctx.response.status = 404;
    }
  });

  router.post("/todos", async ctx => {
    const result = await collection.insertOne({
      _id: new ObjectID().toHexString(),
      text: ctx.request.body.text,
      done: false
    });
    ctx.body = result.ops[0];
  });

  router.delete("/todos/:id", async ctx => {
    const result = await collection.deleteOne({ _id: ctx.params.id });
    if (result.deletedCount === 0) {
      ctx.response.status = 404;
      ctx.body = "";
    } else {
      ctx.response.status = 204;
    }
  });

  router.put("/todos/:id", async ctx => {
    if (!ctx.request.body.text && typeof ctx.request.body.done !== "boolean") {
      return (ctx.response.status = 400);
    }
    const $set = {};
    if (ctx.request.body.text) {
      $set.text = ctx.request.body.text;
    }
    if (typeof ctx.request.body.done === "boolean") {
      $set.done = ctx.request.body.done;
    }
    const result = await collection.findOneAndUpdate(
      { _id: ctx.params.id },
      { $set },
      { returnOriginal: false }
    );
    if (result.value) {
      ctx.response.status = 200;
      ctx.body = result.value;
    } else {
      ctx.response.status = 404;
    }
  });
}

module.exports.loadRoutes = loadRoutes;
