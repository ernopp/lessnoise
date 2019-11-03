# What

Sign in with Twitter, and see _Unfollow_ Recommendations: who tweets too much and you should remove to clean up your feed (sadly
[Twitter didn't follow through with shipping this](https://www.engadget.com/2018/08/30/twitter-test-personalized-unfollow-recommendations))

# Disclaimer

I am a bad developer and there is a lot of bad stuff in here. Feel free to [tell me](https://ernie.news/get-in-touch/) things I'm doing horribly wrong or submit a PR. Thanks!

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


# Resources

* See [Resources.md](Resources.md) for a list of things I used and read up on for this project.

# Gotchas

* Make sure `PORT` is set, even locally.
