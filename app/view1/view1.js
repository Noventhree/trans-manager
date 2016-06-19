'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.controller('View1Ctrl', ['$scope', 'User', 'Item','Transaction',
            function($scope, User, Item, Transaction) {
  var item1 = new Item('chleb', 10);
  var item2 = new Item('mleko', 20);
  var item3 = new Item('apap', 50);
  var user1 = new User('Szymon', 45);
  var user2 = new User('Marcin', 10);
  var user3 = new User('Grześ', 210);

  var transaction1 = new Transaction({
                                      users: [user1, user2, user3],
                                      items: [item1, item2, item3]
                                    });

  $scope.transaction = transaction1;
  $scope.newUser = {};
  $scope.newItem = {};
  $scope.togglePop = false;
  $scope.toggleItem = false

}]);1
