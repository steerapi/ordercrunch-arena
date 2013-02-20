app.directive "applyJqMobile", ->
  ($scope, el) ->
    setTimeout (->
      $scope.$on "$viewContentLoaded", el.trigger("create")
    ), 1
