'use strict';

var users = global.nss.db.collection('users');
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');

class User {
  static login(obj, fn) {
    users.findOne({email:obj.email}, (err,user)=>{
      if(user) {
        if(bcrypt.compareSync(obj.password,user.password)) {
          fn(user);
        }
        else {
          fn(null);
        }
      }
      else {
        fn(null);
      }
    });
  }

  static findByUserId(userId, fn) {
    userId = Mongo.ObjectID(userId);
    users.findOne({_id:userId}, (e,u)=>{
        fn(u);
    });
  }
}


module.exports = User;
