/* jshint unused: false */

'use strict';

var portfolios = global.nss.db.collection('portfolios');
// var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var fs = require('fs');

class Portfolio {
  constructor(userId, fields, files) {
    this.title = fields.title[0];
    this.description = fields.description[0];
    this.tags = fields.tags;
    this.git = fields.git[0];
    this.app = fields.app[0];
    this.date = new Date(fields.date);
    this.photos = files.photos.map(p=>p.originalFilename);
    this.userId = Mongo.ObjectID(userId);
  }

  static create(userId, fields, files, fn) {
    var pjt = new Portfolio(userId, fields,files);
    pjt.saveFiles2Local(files);
    portfolios.save(pjt, ()=>fn());
  }

  saveFiles2Local(files) {
    files.photos.forEach(p=>{
      var userId = this.userId.toString();
      if(!fs.existsSync(`${__dirname}/../static/img/${userId}`)) {
        fs.mkdirSync(`${__dirname}/../static/img/${userId}`);
      }
      fs.renameSync(p.path, `${__dirname}/../static/img/${userId}/${p.originalFilename}`);
    });
  }

}


module.exports = Portfolio;
