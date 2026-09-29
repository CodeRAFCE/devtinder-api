# Express `.use()`

`.use()` applies middleware to a path and all of its subroutes.

- Middleware mounted at `/health-check` runs for routes such as `/health-check/status`.
- The same prefix-matching behavior applies to any path passed to `.use()`.

// Older route techniques
// app.get("/use?r", (req, res) => {
// res.send({ firstName: "Seshan", lastName: "A" });
// });

// Express 5 completely upgraded its route parsing engine
//You cannot use regex quantifiers directly inside route path strings anymore.
// To fix this pass a real JavaScript RegExp literal instead of a string:
app.get(/^\/use?r$/, (req, res) => {
res.send({ firstName: "Seshan", lastName: "A" });
});

// app.use("/", (req, res) => {
// res.send("Any route with prefix / will execute depending on the order");
// });

# This code will execute the first route handler and 2nd route as well but:

1. When the client sends a request the route handler should send a response always `res.send()`
2. Now since the 1st Route handler has `next()` this will go to the next route handler and execute but does not send the respose back again
3. Because The TCP connection is closed during the first `res.send()` in the first route handler
4. Basic thing which we need to understand is that when a client requests for a data the TCP handshake happens and once you get back a response from the server the connection is closed and cannot send anymore response from server.

5) So never try the below code in production per connection you can only one response
6) `next()` always expects a route handler if there is not futher `(req, res) => {}` to execute with `res.send()` it will throw an error `Cannot get /user`.
7) If there is no response the requst will leave hanging in a loop without any response sent back.

`app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling 1st request");
    res.send("1st method");
    next();
  },
  (req, res) => { 
    console.log("2nd method");
    res.send("2nd Response"); // ERROR: Cannot set headers after they are sent to the client
  },
);`

# OUTPUT: for /user

- 1st method
