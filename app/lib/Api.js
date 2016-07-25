'use strict';

let UserSchema = require('../../../../models/user');
let ldap = require('../../../../ldap');
let async = require('async');
let _ = require('lodash');
let FastMap = require('collections/fast-map');

module.exports = (app) => {
  
  /**
   * Get users list
   */
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

  /**
   * Add selected users to LDAP (fix missing LDAP entries)
   */
  app.post('/admin/api/users/ldap', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      ldap.addUser(user, () => {
        callback();
      })
    }, () => {
      res.send({status: 'OK'});
    });
  });

  /**
   * Add selected users to MongoDb (fix missing MongoDb entries)/ Update users (data, groups)
   */
  app.post('/admin/api/users/mongo', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      let userMongo = new UserSchema(user);
      userMongo.save(() => {
        callback();
      })
    }, () => {
      res.send({status: 'OK'});
    });
  });
};