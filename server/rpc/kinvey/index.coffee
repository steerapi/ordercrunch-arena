Kinvey = require "kinvey"

key = require "./dev"
if process.env.NODE_ENV=="production"
  key = require "./deploy"

appKey = key.appKey
appSecret = key.appSecret
masterSecret = key.masterSecret

Kinvey.init
  appKey: appKey
  appSecret: appSecret 
  masterSecret: masterSecret

Kinvey.User::me = (options)->
  url = @store._getUrl({ id: '_me' })
  @store._send('GET', url, null, options)

# Kinvey.masterSecret = null
# console.log "CREATE"
admin = new Kinvey.User()
admin.login "admin", "admin",
  success: ->
    console.log "We're in."
    # Kinvey.delGroup "test", ->
    #   console.log arguments...
    # Kinvey.createGroup "test", [], ->
    #   console.log arguments...
    # Kinvey.addGroupUser "test", "50eaf36dde94998e31000e98", ->
    #   console.log arguments...

Kinvey.removeUser =  (username, password, cb)->
  Kinvey.masterSecret = null
  user = new Kinvey.User()
  user.login username, password,
    success: (user)->
      # user.set "destroyed", "true"
      # user.save
      #   success: ->
      #     console.log arguments...
      #   error: ->
      #     console.log arguments...
      user.destroy
        success: ->
          Kinvey.masterSecret=masterSecret
          Kinvey.setCurrentUser(admin)
          cb? null
        error: (e)->
          Kinvey.masterSecret=masterSecret
          Kinvey.setCurrentUser(admin)
          cb? e
    error: (e)->
      Kinvey.masterSecret=masterSecret
      Kinvey.setCurrentUser(admin)
      cb? e
  # Kinvey.masterSecret=masterSecret
  # Kinvey.setCurrentUser(admin)

user = new Kinvey.User()
Kinvey.runAsCurrentUser = (fn)->
  Kinvey.masterSecret = null
  Kinvey.setCurrentUser(user)
  fn()
  Kinvey.masterSecret=masterSecret
  Kinvey.setCurrentUser(admin)
  
Kinvey.authenticate = (token, cb)->
  # console.log "HERE"
  user.token = token
  Kinvey.runAsCurrentUser ->
    user.me 
      success: (user)->
        console.log "user", user
        cb? null, user
      error: (err)->
        cb? "error", err

request = require "superagent"
server = "https://baas.kinvey.com"
token = new Buffer(Kinvey.appKey + ':' + Kinvey.masterSecret, 'utf8').toString('base64')
basicToken = "Basic #{token}"

Kinvey.createGroup = (_id, uids, cb)->
  userRefs = []
  for uid in uids
    userRefs.push
      _type: "KinveyRef"
      _collection: "user"
      _id: uid
  request.post("#{server}/group/#{appKey}/")
  .send
    _id: _id
    users:
      all: "false"
      list: userRefs
  .set("Authorization", basicToken).end (res)->
    cb? res.body.error, res.body
Kinvey.getGroup = (_id, cb)->
  request.get("#{server}/group/#{appKey}/#{_id}").set("Authorization", basicToken).end (res)->
    cb? res.body.error, res.body
Kinvey.delGroup = (_id, cb)->
  request.del("#{server}/group/#{appKey}/#{_id}").send({_id:"#{_id}"}).set("Authorization", basicToken).end (res)->
    cb? res.body.error, res.body
Kinvey.addGroupUser = (_id, uid, cb)->
  Kinvey.getGroup _id, (err, group)->
    (cb? err; return;) if err
    group.users.list.push 
      _type: "KinveyRef"
      _collection: "user"
      _id: uid
    request.put("#{server}/group/#{appKey}/#{_id}")
    .send(group).set("Authorization", basicToken).end (res)->
      cb? res.body.error, res.body
Kinvey.delGroupUser = (_id, uid, cb)->
  Kinvey.getGroup _id, (err, group)->
    (cb? err; return;) if err
    group.users.list.splice group.users.list.indexOf(uid), 1
    request.put("#{server}/group/#{appKey}/#{_id}")
    .send(group).set("Authorization", basicToken).end (res)->
      cb? res.body.error, res.body

# Kinvey.autheticate "7eb2e01b-c50a-4ea4-9ada-8d597bcb770c.Tf6zmaOXLl1leBKFtFKrc1cUwzrzslDLAOAdphqIhZ0=", ->
  # console.log arguments...

module.exports = Kinvey