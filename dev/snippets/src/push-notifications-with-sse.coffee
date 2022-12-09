###

thx to https://medium.com/trabe/server-sent-events-sse-streams-with-node-and-koa-d9330677f0bf

open http://localhost:8088, and in the developer tools console, insert

```
const source = new EventSource("http://localhost:8080/sse");
source.onopen = () => console.log("Connected");
source.onerror = console.error;
source.onmessage = console.log;
```

###


```
const Koa = require("koa");
const { PassThrough } = require("stream");

new Koa().
  use(async (ctx, next) => {
    if (ctx.path !== "/sse") {
      return await next();
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      'Access-Control-Allow-Origin'; '*',
    });

    const stream = new PassThrough();

    ctx.status = 200;
    ctx.body = stream;

    const interval = setInterval(() => {
      stream.write(`data: ${new Date()}\n\n`);
    }, 1000);

    stream.on("close", () => {
      clearInterval(interval);
    });


  })
  .use(ctx => {
    ctx.status = 200;
    ctx.body = `
const source = new EventSource("http://localhost:8088/sse");
source.onopen = () => console.log("Connected");
source.onerror = console.error;
source.onmessage = console.log;
    `;
  })
  .listen(8088, () => console.log("Listening"));
```