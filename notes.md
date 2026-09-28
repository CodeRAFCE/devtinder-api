# Express `.use()`

`.use()` applies middleware to a path and all of its subroutes.

- Middleware mounted at `/health-check` runs for routes such as `/health-check/status`.
- The same prefix-matching behavior applies to any path passed to `.use()`.
