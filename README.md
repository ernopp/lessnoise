# What

Sign in with Twitter, and see _Unfollow_ Recommendations: who tweets too much and you should remove to clean up your feed (sadly
[Twitter didn't follow through with shipping this](https://www.engadget.com/2018/08/30/twitter-test-personalized-unfollow-recommendations))

# Run Locally

`nodemon start`

Env variables:

* `NODE_ENV`: `production` or `development`
* `DEBUG`: e.g `lessnoise:*`
* `PORT`

# Run with Heroku

* `heroku local web`
* `git push heroku master`
* Set env variables in Heroku
    * `KEY`, `SECRET`, `SESSIONSECRET`, `USETESTDATA`


# Gotchas

* Make sure `PORT` is set, even locally
