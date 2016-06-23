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
    hasItem: function (id){
      if (id){
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i] === id) {
            return true
          };
        };
        return false
      };
      return this.history === [] ? false : true
    },
    clearHistory: function(){
      this.history = [];
      return this
    },
    resetCash: function(){
      this.cashLeft = this.cash;
      return this
    },
    addHistory: function(item, moneySpent){
      this.history.push({
        id: item.id,
        moneySpent: moneySpent,
        name: item.name
      });
      // console.log('history of id:' + item.id + ' added');
      return this
    },
    hasHistory: function(id) {
      if (id){
        for (var i = 0; i < this.history.length; i++) {
          if (this.history[i].id === id) {
            return true
          };
        };
        return false
      };
      return this.history === [] ? false : true
    },
    removeHistory: function(id){
      // console.log('remove ran for id: ' + id)
      for (var i = 0; i < this.history.length; i++) {
        if (this.history[i].id === id) {
          this.history.splice(i, 1)
          // console.log('history of id:' + id + ' removed');
          break
        };
      };
      return this
    },
    changeHistory: function(id, nMoneySpent){
      for (var i = 0; i < this.history.length; i++) {
        if (this.history[i].id === id) {
          this.history[i].moneySpent = nMoneySpent
          break
        }
      }
      return this
    },
    getHistory: function (id) {
      for (var i = 0; i < this.history.length; i++) {
        if (this.history[i].id === id) {
          return this.history[i]
        };
      };
    },
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
        // console.log('user bind to item');
      }else {
        var index = this.owners.indexOf(user.id);
        this.owners.splice(index, 1);
        // console.log('user unbind to item');
      }
    },
    removeBindOwner: function(user){
      if (this.owners.indexOf(user.id) < 0){
      }else {
        var index = this.owners.indexOf(user.id);
        this.owners.splice(index, 1);
        // console.log('user unbind to item');
      }
    },
      hasOwner: function(id) {
        for (var i = 0; i < this.owners.length; i++) {
          if (this.owners[i] === id) {
            return true
          };
          return false
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
        // user.clearHistory();
        user.resetCash();
      });
      angular.forEach(this.items, function(item){

        angular.forEach(that.users, function(user){
          // if (user.hasHistory(item.id) && !item.hasOwner(user.id) || !user.hasHistory(item.id) && item.hasOwner(user.id)) {
          //   user.removeHistory(item.id)
          // };
          // console.log(item.owners);
          // console.log(item.owners.length === 0);
          // if (!item.hasOwner(user.id)) {
          //   user.removeHistory(item.id);
          //   console.log('user ' + user.id +'removed history with item: ' + item.id);
          //
          // };
          // console.log(user.history);
          angular.forEach(item.owners, function(owner){

            moneySpent = Math.round(-item.price/item.owners.length* 100) / 100;
            // console.log(moneySpent);
            console.log(moneySpent);
            if (owner === user.id){




              user.dCash(moneySpent);
              if (user.hasHistory(item.id)) {
                // console.log('item: '+ item.id +' hasHistory ' + 'with user ' + user.id);
                if (user.getHistory(item.id).moneySpent === moneySpent) {
                  // console.log('user ' + user.id +'did NOT change history with item: ' + item.id);
                }else if (user.getHistory(item.id).moneySpent === 0) {
                  console.log(moneySpent);
                  // console.log('user ' + user.id +'removed history with item: ' + item.id);
                  user.removeHistory(item.id)

                }else {
                  // console.log('user ' + user.id +'changed history with item: ' + item.id + ' from ' + user.getHistory(item.id).moneySpent + ' to ' + moneySpent);
                  user.changeHistory(item.id, moneySpent)
                }

              } else if (!user.hasHistory(item.id)) {
                // console.log('item: '+ item.id +' hasNotHistory ' + 'with user ' + user.id + ' new history added')
                // console.log(item.owners);
                // console.log(user.items);
                // console.log(user.getHistory(item.id));
                user.addHistory(item, moneySpent)
                // console.log(item.owners);
                // console.log(user.items);
                // console.log(user.getHistory(item.id));
              }





            };


          });
          // if (!item.hasOwner(user.id)) {
          //   user.removeHistory(item.id);
          // }
          if (item.owners.length === 0 || (!item.hasOwner(user.id) && !user.hasItem(item.id))) {
            user.removeHistory(item.id);
            // console.log('user ' + user.id +'removed history with item: ' + item.id);

          };

        });
      });
      return this
    },
    addUser: function(user){
      var newUser = new User(user.name, user.cash);
      this.users.push(newUser);
      return this
    },
    addItem: function(item){
      var newItem = new Item(item.name, item.price);
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
