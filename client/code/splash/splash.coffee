window.app = angular.module("OCArenaApp", []).config(["$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) ->
  $routeProvider.when("/",
    templateUrl: "main.html"
  ).when("/about",
    templateUrl: "about.html"
  ).when("/careers",
    templateUrl: "careers.html"
  ).when("/legal",
    templateUrl: "legal.html"
  ).when "/more",
    templateUrl: "more.html"
  $locationProvider.html5Mode true
])
angular.bootstrap(document, ['OCArenaApp'])
