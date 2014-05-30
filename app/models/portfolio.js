/* jshint unused: false */

'use strict';

var portfolios = global.nss.db.collection('portfolios');
// var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var fs = require('fs');
var path= require('path');
var _ = require('lodash');
var rimraf = require('rimraf');

class Portfolio {
  constructor(userId, fields, files) {
    this.title = fields.title[0];
    this.description = fields.description[0];
    this.tags = fields.tags;
    this.git = fields.git[0];
    this.app = fields.app[0];
    this.date = new Date(fields.date[0]);
    this.photos = [];
    this.userId = Mongo.ObjectID(userId);
  }

  static destroyById(pId, fn) {
    pId = Mongo.ObjectID(pId);
    portfolios.findAndRemove({_id:pId}, (e,p)=>{
      var title = p.title.toLowerCase().replace(/[^\w]/g,'');
      var photoDir = `${__dirname}/../static/img/${p.userId.toString()}/${title}`;
      rimraf(photoDir, ()=>fn());
    });
  }

  static findAll(fn) {
    portfolios.find().toArray((e,portfolio)=>fn(portfolio));
  }

  static findById(id, fn) {
    id = Mongo.ObjectID(id);
    portfolios.findOne({_id:id}, (e,p)=>{
      p = _.create(Portfolio.prototype, p);
      fn(p);
    });
  }

  static create(userId, fields, files, fn) {
    var pjt = new Portfolio(userId, fields,files);
    pjt.processPhotos(files);
    portfolios.save(pjt, ()=>fn());
  }

  removePhoto(index, fn) {
    var localFile = `${__dirname}/../static${this.photos[index].filename}`;
    this.photos.splice(index,1);
    fs.unlinkSync(localFile);
    portfolios.save(this, ()=>fn());
  }

  update(fields, fn) {
    this.title = fields.title;
    this.description = fields.description;
    this.tags = fields.tags;
    this.git = fields.git;
    this.app = fields.app;
    portfolios.save(this, ()=>fn());
  }

  processPhotos(files) {
    files.photos.forEach((p,i)=>{
      var userId = this.userId.toString();
      var title = this.title.toLowerCase().replace(/[^\w]/g,'');
      var photo = `/img/${userId}/${title}/${i}${path.extname(p.originalFilename)}`;
      this.photos.push({filename:photo, isPrimary:false, origFileName:p.originalFilename});

      var userDir = `${__dirname}/../static/img/${userId}`;
      var pjtDir  = `${userDir}/${title}`;
      var fullDir = `${pjtDir}/${i}${path.extname(p.originalFilename)}`;

      pjtDir = path.normalize(pjtDir);
      this.pjtDir = pjtDir;

      if(!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }
      if(!fs.existsSync(pjtDir)) {
        fs.mkdirSync(pjtDir);
      }
      fs.renameSync(p.path, fullDir);
    });
  }

}


module.exports = Portfolio;
