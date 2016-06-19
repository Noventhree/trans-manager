'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'ngAnimate',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.factory('User', function(){
  function User(name, cash, items){
    // if (name) {
      this.name = name;
      this.cash = cash || 0;
      this.cashLeft = this.cash
      this.items = items || [];
      this.id = idFactoryUser();
      this.history = [];
    };
  User.prototype = {
    constructor: User,
    dCash: function(n) {
      this.cashLeft += n;
    },
    toggleBindItem: function(item) {
      if (this.items.indexOf(item.id) < 0){
        this.items.push(item.id)
        // console.log('item bind to user');
      }else{
        // console.log('item unbind to user');
        var index = this.items.indexOf(item.id);
        this.items.splice(index, 1);
      }
    },
    removeBindItem: function(item){
      if (this.items.indexOf(item.id) < 0){
      }else{
        // console.log('before ' + this.items);
        // console.log('item unbind to user');
        var index = this.items.indexOf(item.id);
        this.items.splice(index, 1);
        // console.log('after ' + this.items);
      }
    },
    clearHistory: function(){
      this.history = [];
      return this
    },
    resetCash: function(){
      this.cashLeft = this.cash;
      return this
    }
  };
  return User
})
.factory('Item', function () {
  function Item(name, price) {
    this.name = name;
    this.price = price || 0;
    this.owners = [];
    this.id = idFactoryItem();
  };
  Item.prototype = {
    constructor: Item,
    toggleBindOwner: function(user){
      if (this.owners.indexOf(user.id) < 0){
        this.owners.push(user.id)
        console.log('user bind to item');
      }else {
        var index = this.owners.indexOf(user.id);
        this.owners.splice(index, 1);
        console.log('user unbind to item');
      }
    },
    removeBindOwner: function(user){
      if (this.owners.indexOf(user.id) < 0){
      }else {
        var index = this.owners.indexOf(user.id);
        this.owners.splice(index, 1);
        console.log('user unbind to item');
      }
    },
  };
  return Item
})
.factory('Transaction', ['User', 'Item', function (User, Item) {
  function Transaction(obj){

    this.users = obj.users;
    this.items = obj.items;
    this.totalCash = 0;
    this.totalPrice = 0;
    this.saldo = 0;
    var that = this;
    angular.forEach(this.users,function(user){
      that.totalCash += user.cash;
    });
    angular.forEach(this.items,function(item){
      that.totalPrice += item.price;
    });
  };
  Transaction.prototype = {
    constructor: Transaction,
    run: function(){
      var that = this;
      var moneySpent = 0;
      console.log('transaction runned');

      angular.forEach(that.users, function(user){
        user.clearHistory();
        user.resetCash();
      });
      angular.forEach(this.items, function(item){
        angular.forEach(item.owners, function(owner){
          angular.forEach(that.users, function(user){
            if (owner === user.id){
              // user.cashLeft = user.cash;
              moneySpent = -item.price/item.owners.length;
              user.dCash(moneySpent);
              user.history.push({
                id: item.id,
                moneySpent: moneySpent,
                name: item.name
              });
              // console.log('user: ' + user.id + ' spent ' + moneySpent);
              // if (user.cash >= 0){
              //   var index = this.items.indexOf(item);
              //   this.items.splice(index, 1);
              // };

            };
          });

        });
      });
      return this
    },
    addUser: function(obj){
      var newUser = new User(obj.name, obj.cash);
      this.users.push(newUser);
      return this
    },
    addItem: function(obj){
      var newItem = new Item(obj.name, obj.price);
      this.items.push(newItem);
      return this
    },
    removeUser: function(user){
      //remove user obj and all its bindings in item obj
      angular.forEach(this.items, function(item){
        // console.log("user #" + user.id + "has removed its binding form item #" + item.id);
        user.removeBindItem(item);
        item.removeBindOwner(user);
      });
      var index = this.users.indexOf(user);
      this.users.splice(index, 1);
      return this
    },
    removeItem: function(item){
      //remove item obj and all its bindings in user obj
      angular.forEach(this.users, function(user){
        // console.log("user #" + user.id + "has removed its binding form item #" + item.id);
        user.removeBindItem(item);
        item.removeBindOwner(user);
      });
      var index = this.items.indexOf(item);
      this.items.splice(index, 1);
      return this
    },
    updateState: function(){
      var that = this;
      this.saldo = 0;
      that.totalCash = 0;
      that.totalPrice = 0;

      angular.forEach(this.users,function(user){
        that.totalCash += user.cash;
      });
      angular.forEach(this.items,function(item){
        that.totalPrice += item.price;
      });
      this.saldo = this.totalCash - this.totalPrice;
    }
  };
  return Transaction
}])


var IdFactory = function(){
  var counter = 0;
  return function(){
    counter++;
    return counter
  };
};
var idFactoryUser = IdFactory();
var idFactoryItem = IdFactory();
