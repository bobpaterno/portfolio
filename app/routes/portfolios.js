'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var Portfolio = traceur.require(__dirname+'/../models/portfolio.js');

exports.index = (req, res)=>{
  Portfolio.findAll(portfolios=>{
    res.render('portfolios/index', {projects:portfolios, title: 'Portfolio Index'});
  });
};

exports.new = (req, res)=>{
  res.render('portfolios/new', {title: 'Portfolio Add Project'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    Portfolio.create(req.session.userId, fields, files, ()=>{
      res.redirect('/portfolios');
    });
  });
};

exports.show = (req, res)=>{
  Portfolio.findById(req.params.id, portfolio=>{
    res.render('portfolios/show', {project:portfolio, title:'Portfolio Show'});
  });
};

exports.destroy = (req, res)=>{
  Portfolio.destroyById(req.params.id, ()=>{
    res.redirect('/portfolios');
  });
};

exports.edit = (req, res)=>{
  Portfolio.findById(req.params.id, portfolio=>{
    res.render('portfolios/edit', {project:portfolio, title: 'Portfolio Edit Project'});
  });
};

exports.update = (req, res)=>{
  Portfolio.findById(req.params.id, portfolio=>{
    portfolio.update(req.body, ()=>{
      res.redirect('/portfolios');
    });
  });
};
