class BusinessAPI
  createStore: (args)->
    gameID = args.gameID
    doc = args.doc
    response =
      id: "1234"
      gameID: gameID
      numPerson: 10
      maxOrderPerson: 100
    return response
  updateStore: (args)->
    storeID = args.storeID
    doc = args.doc
    return doc
  createItem: (args)->
    doc = args.doc
    return doc
  updateItem: (args)->
    itemID = args.itemID
    doc = args.doc
    return doc
  deleteItem: (args)->
    itemID = args.itemID
    return {}
  listItem: (args)->
    itemID = args.itemID
    response = [
      id: "1"
      image: ""
      name: "Burger"
      desc: "Delicious"
      price: 10
    ,
      id: "1"
      image: ""
      name: "Burger"
      desc: "Delicious"
      price: 10
    ]
    return response
  getDashboard: (args)->
    storeID = args.storeID
    response = [
      "time": "7:00"
      "1": "20/20"
      "2": "20/20"
      "3": "20/20"
    ,
      "time": "7:15"
      "1": "10/20"
      "2": "10/20"
      "3": "10/20"
    ]
    return response
  getDeliveryUnit: (args)->
    storeID = args.storeID
    unitID = args.unitID
    time = args.time
    response = [
      seat: "s1"
      name: "Ryan"
      items: [
        id: "1"
        name: "Burger"
      ]
    ,
      seat: "s2"
      name: "Ryan"
      items: [
        id: "1"
        name: "Hot Dog"
      ]
    ]
    return response

module.exports = new BusinessAPI()