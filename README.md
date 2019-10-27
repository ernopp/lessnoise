# What

Sign in with Twitter, and see _Unfollow_ Recommendations: who tweets too much and you should remove to clean up your feed (sadly
[Twitter didn't follow through with shipping this](https://www.engadget.com/2018/08/30/twitter-test-personalized-unfollow-recommendations))

# Resources

* Express routing
https://expressjs.com/en/starter/basic-routing.html
* Express session state https://github.com/expressjs/session#cookiesecure
* Pug templates
https://pugjs.org/api/reference.html
* Nodemon to hot reload node https://nodemon.io/
* Implementing sign-in with Twitter https://developer.twitter.com/en/docs/twitter-for-websites/log-in-with-twitter/guides/implementing-sign-in-with-twitter
* Twitter API
    * Get friends / list https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-friends-list
    * Cursoring https://developer.twitter.com/en/docs/basics/cursoring
    * Rate limiting https://developer.twitter.com/en/docs/basics/rate-limiting.html
* Check for unused dependencies https://www.npmjs.com/package/depcheck
* Twitter app settings https://apps.twitter.com/app/5573851/settings
* Todos https://trello.com/b/skM82nUh/lessnosie


# Run

`nodemon ./bin/www` (development - not setting node_env defaults it to development)

`set node_env=production && nodemon ./bin/www`




