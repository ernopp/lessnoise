# What

Sign in with Twitter, and see _Unfollow_ Recommendations: who tweets too much and you should remove to clean up your feed (sadly
[Twitter didn't follow through with shipping this](https://www.engadget.com/2018/08/30/twitter-test-personalized-unfollow-recommendations))

# Resources

* Express
    * Understanding Express https://evanhahn.com/understanding-express/
    * Express routing
https://expressjs.com/en/starter/basic-routing.html
    * Express session state https://github.com/expressjs/session#cookiesecure
    * Ended up using `cookie-session` to store session data encrypted in the cookie, not compatible with Heroku Dynos
    * List of express session stores https://github.com/expressjs/session/blob/master/README.md#compatible-session-stores
    * Why `bin/www` https://stackoverflow.com/questions/23169941/what-does-bin-www-do-in-express-4-x
* Pug
    * Pug templates https://pugjs.org/api/reference.html
* Node utils
    * Nodemon to hot reload node https://nodemon.io/
    * Check for unused dependencies https://www.npmjs.com/package/depcheck
* Twitter API
    * Implementing sign-in with Twitter https://developer.twitter.com/en/docs/twitter-for-websites/log-in-with-twitter/guides/implementing-sign-in-with-twitter
    * Callback URLs https://developer.twitter.com/en/docs/basics/apps/guides/callback-urls
    * `passport-twitter`  http://www.passportjs.org/docs/twitter/
    * Get friends / list https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-friends-list
    * Cursoring https://developer.twitter.com/en/docs/basics/cursoring
    * Rate limiting https://developer.twitter.com/en/docs/basics/rate-limiting.html
    * Destroy Friendship https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/post-friendships-destroy.html
* Styling
    * Data tables https://datatables.net/examples/styling/bootstrap4.html & https://github.com/DataTables/DataTables
* Deploying / Production
    * Express performance best practices https://expressjs.com/en/advanced/best-practice-performance.html
        * you can use the `--trace-sync-io` command-line flag to print a warning and a stack trace whenever your application uses a synchronous API
    * Express Security best practices https://expressjs.com/en/advanced/best-practice-security.html
    * Mozilla guide https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
* Admin
    * Twitter app settings https://apps.twitter.com/app/5573851/settings
    * Todos https://trello.com/b/skM82nUh/lessnosie


# Run

`nodemon start`

Env variables:

* `NODE_ENV`: `production` or `development`
* `DEBUG`: e.g `lessnoise:*`
* `PORT`



