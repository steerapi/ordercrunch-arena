class GameAPI
  getGames: (args)->
    where = args.where
    time = args.time
    type = args.type
    response = [
      id: 1
      type: "Basketball"
      time: moment().unix()
      where: "Houston"
      info:
        home: "A"
        away: "B"
    ,
      id: 2
      type: "Basketball"
      time: moment().unix()
      where: "Houston"
      info:
        home: "A"
        away: "B"
    ]
    return response

module.exports = new GameAPI()