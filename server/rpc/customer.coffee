class CustomerAPI
  getItems: (args)->
    gameID = args.gameID
    type = args.type
    response = [
      id: "1"
      image: ""
      name: "Burger"
      desc: "Delicious"
      price: 10
    ,
      id: "2"
      image: ""
      name: "Hot Dog"
      desc: "Delicious"
      price: 10
    ]
    return response
  getScores: (args)->
    gameID = args.gameID
    response = [
      home:
        name: ""
        abbr: "A"
        score: 10
      away:
        name: ""
        abbr: "B"
        score: 10
    ]
    return response
  getBoxScores: (args)->
    gameID = args.gameID
    response = [
      team: "A" 
      "1": 1
      "2": 1
      "3": 1
    ,
      team: "B" 
      "1": 1
      "2": 1
      "3": 1
    ]
    return response
  getPrevOrders: (args)->
    username = args.username
    response = [
      from:
        id: 1
        name: "Ryan"
        seat: "s1"
      items: [
        id: "1"
        image: ""
        name: "Burger"
        desc: "Delicious"
        price: 10
        qty: 2        
      ]
      to:
        id: 1
        name: "Consession 1"
    ]
    return response
  getDeliveryTime: (args)->
    username = args.username
    storeID = args.storeID
    seat = args.seat
    response = [
      time: "7:30pm"
    ,
      time: "8:00pm"
    ]
    return response
  openTrx: (amount, order)->
    response =
      trxId: "xxx"
    return response
  submit: (order)->
    response = 
      status: "ok"
    return response
    
module.exports = new CustomerAPI()