window.app = angular.module("app", [])
US = require("./statelist").US

class GameCtrl
  section: =>
    $("#section").mobiscroll().select
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      # width: 200
    .mobiscroll('show')
  row: =>
    $("#row").mobiscroll().select
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      # width: 200
    .mobiscroll('show')
  seat: =>
    $("#seat").mobiscroll().treelist
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      labels: ['Section', 'Row', 'Seat']
      onSelect: (x,y,z)=>
        x = x.replace /\s/g, ""
        @scope.seatNumber = "#{x}"
        @scope.$apply() if not @scope.$$phase
      # width: 200
    .mobiscroll('show')
  where: =>
    $("#where").mobiscroll().select
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      # width: 200
    .mobiscroll('show')
  when: =>
    $("#whenScroller").mobiscroll().calendar
      mode: 'scroller'
      controls: ['calendar']
      inputClass: 'i-txt'
      # display: 'inline'
      # width: 200
      # theme: 'ios'
    .mobiscroll('show')
  game: =>
    $.mobile.changePage "#pageMain"
  constructor: (@scope)->
    $.extend @scope, @
    # alert "created", @scope
GameCtrl.$inject = ['$scope']
app.controller "GameCtrl", GameCtrl

class MenuCtrl
  add: (event)=>
    moveFromTo $(event.currentTarget), $('.target')
  seat: =>
    $("#seat").mobiscroll().treelist
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      labels: ['Section', 'Row', 'Seat']
      # width: 200
    .mobiscroll('show')
  time: =>
    $("#time").mobiscroll().select
      # theme: 'ios'
      # display: 'inline'
      mode: 'scroller'
      inputClass: 'i-txt'
      # width: 200
    .mobiscroll('show')
  constructor: (@scope)->
    $.extend @scope, @
MenuCtrl.$inject = ['$scope']
app.controller "MenuCtrl", MenuCtrl

class LoginCtrl
  login: =>
    $.mobile.changePage "#pageGame"
  constructor: (@scope)->
    $.extend @scope, @
LoginCtrl.$inject = ['$scope']
app.controller "LoginCtrl", LoginCtrl

class StatCtrl
  constructor: (@scope)->
    $.extend @scope, @
StatCtrl.$inject = ['$scope']
app.controller "StatCtrl", StatCtrl

class AccountCtrl
  constructor: (@scope)->
    $.extend @scope, @
AccountCtrl.$inject = ['$scope']
app.controller "AccountCtrl", AccountCtrl

class OrdersCtrl
  constructor: (@scope)->
    $.extend @scope, @
OrdersCtrl.$inject = ['$scope']
app.controller "OrdersCtrl", OrdersCtrl

moment = require "moment"
class BodyCtrl
  add: (event)=>
    moveFromTo $(event.currentTarget), $('.target')
  constructor: (@scope)->
    $.extend @scope, @
    @scope.statelist = US
    @scope.state = "Texas"
    console.log moment()
    @scope.date= (new Date()).toString()
    
    # alert "created", @scope
BodyCtrl.$inject = ['$scope']
app.controller "BodyCtrl", BodyCtrl
app.directive "ocCarousel", ($parse)->
  restrict: "A"
  link: (scope, element, attrs, controller)->
    setTimeout ->
      element.touchCarousel {}
        # scrollbar: false
        # scrollbarAutoHide: true
    , 100

angular.bootstrap(document, ['app'])
