'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname+'/../models/user.js');

exports.lookup = (req, res, next)=>{
  User.findByUserId(req.session.userId, user=>{
    res.locals.user = user;
    next();
  });
};

exports.login = (req, res)=>{
  res.render('users/login', {title: 'Login'});
};

exports.logout = (req, res)=>{
  req.session.userId = null;
  res.redirect('/');
};

exports.authenticate = (req, res)=> {
  User.login(req.body, user=>{
    if(user) {
      req.session.userId = user._id;
      res.redirect('/portfolios');
    }
    else {
      req.session.userId = null;
      res.redirect('/login');
    }
  });
};
