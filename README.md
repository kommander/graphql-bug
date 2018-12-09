# Reproduction guide for `[object Object]` error messages

1. Install all dependencies, either `yarn` or `npm install`
2. `node index.js`
3. Visit `http://localhost:300(0|1)/graphql` (Doesn't really matter)
4. Create two tabs with distinct endpoints of `http://localhost:300(0|1)/graphql` with the following content:
  ```graphql
    query {
      fire
    }
  ```
5. Observe the results of both queries. Either argue that this is a bug or is an intended behavior