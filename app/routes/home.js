'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'Home'});
};

exports.about = (req, res)=>{
  res.render('home/about', {title: 'About'});
};

exports.contact = (req, res)=>{
  res.render('home/contact', {title: 'Contact'});
};

exports.resume = (req, res)=>{
  res.render('home/resume', {title: 'Resume'});
};
