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
    * Check for unused dependencies `depcheck` https://www.npmjs.com/package/depcheck
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
    * Meta tags https://css-tricks.com/essential-meta-tags-social-media/
        * The URL of the image for your object. It should be at least 600x315 pixels, but 1200x630 or larger is preferred (up to 5MB). Stay close to a 1.91:1 aspect ratio to avoid cropping.
    * Facebook sharing debugger https://developers.facebook.com/tools/debug/sharing/?q=https%3A%2F%2Fwww.lessnoise.net
    * Twitter card validator https://cards-dev.twitter.com/validator
* Deploying / Production
    * Express performance best practices https://expressjs.com/en/advanced/best-practice-performance.html
        * you can use the `--trace-sync-io` command-line flag to print a warning and a stack trace whenever your application uses a synchronous API
    * Express Security best practices https://expressjs.com/en/advanced/best-practice-security.html
    * Mozilla guide https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
* Heroku
    * Custom domains setup https://devcenter.heroku.com/articles/custom-domains
        * make sure you set up both www. and the root domain in Heroku
    * Configure Cloudflare and Heroku over HTTPS https://support.cloudflare.com/hc/en-us/articles/205893698-Configure-CloudFlare-and-Heroku-over-HTTPS

* Admin
    * Twitter app settings https://apps.twitter.com/app/5573851/settings
    * Todos https://trello.com/b/skM82nUh/lessnosie
    * Heroku https://dashboard.heroku.com/auth/heroku/callback?code=86445b4c-e004-40f7-9e2a-1ffabfe4f5b7
    * Google Domains https://domains.google.com/m/registrar/
    * Cloudflare (DNS server) https://dash.cloudflare.com/73f5ec80ff593b62e6c332da589dbe7c/lessnoise.net/dns
    * GA https://analytics.google.com/analytics/web/#/report-home/a131357140w214952667p205577433
* Debuggging
    *  `curl -I www.lessnoise.net`
    * Corrupted node modules locally, run `rm -rf node_modules package-lock.json && npm install && npm start`


