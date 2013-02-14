window.app = angular.module("app", [])
class GameCtrl
  add: (event)=>
    moveFromTo $(event.currentTarget), $('.target')
  constructor: (@scope)->
    $.extend @scope, @
    # alert "created", @scope
GameCtrl.$inject = ['$scope']
app.controller "GameCtrl", GameCtrl

class BodyCtrl
  add: (event)=>
    moveFromTo $(event.currentTarget), $('.target')
  constructor: (@scope)->
    $.extend @scope, @
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
