'use strict';

let UserSchema = require('../../../../models/user');
let ldap = require('../../../../ldap');
let async = require('async');
let _ = require('lodash');
let FastMap = require('collections/fast-map');

module.exports = (app) => {
  app.get('/admin/api/users', (req, res) => {
    let map = new FastMap();
    async.parallel([
      function getMongoEntries(callback) {
        UserSchema.find().exec((err, results) => {
          async.each(results, (user, callback) => {
            if (map.get(user.primaryEmail)) {
              map.get(user.primaryEmail).isInMongo = true;
            }
            else {
              _.extend(user, {
                isInMongo: true
              });
              map.set(user.primaryEmail, user);
            }
            callback();
          }, () => {
            callback();
          });
        });
      },
      function getLDAPEntries(callback) {
        // TO DO: implement getting list of LDAP users
        callback();
      }
    ], () => {
      res.send(map.toArray());
    });
  });
};