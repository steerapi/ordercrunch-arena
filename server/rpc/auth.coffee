Kinvey = require "./kinvey"

class AuthAPI
  name: "auth"
  v: 1
  getLogin: (req, res)->
    user = new Kinvey.User()
    user.login req.query.username, req.query.password,
      success: (user)->
        res.send user.toJSON(true)
      error: (e)->
        res.send e
  postSignup: (req, res)->
    Kinvey.User.create req.query,
      success: (user)->
        res.send user.toJSON(true)
      error: (e)->
        res.send e
  getVerifyEmail: (req, res)->
    Kinvey.User.verifyEmail req.query.username
      success: ->
        res.send 200
      error: (e)->
        res.send e
  getIsAvailable: (req, res)->
    q = new Kinvey.Query()
    q.on("username").equal req.query.username
    users = new Kinvey.Collection "user", query:q
    users.fetch
      success: (list)->
        if list.length == 0
          res.send 
            available: true
        else
          res.send 
            available: false
      error: (e)->
        res.send e

module.exports = new AuthAPI()
