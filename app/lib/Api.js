'use strict';

let UserSchema = require('../../../../models/user');
let GroupSchema = require('../../../../models/group');
let ldap = require('../../../../ldap');
let conf = require('../../../../conf');

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
              map.set(user.primaryEmail, {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isInMongo: true,
                isInLDAP: false,
                groups: user.groups,
                primaryEmail: user.primaryEmail
              });
            }
            callback();
          }, () => {
            callback();
          });
        });
      },
      function getLDAPEntries(callback) {
        ldap.getAllUsers((err, results) => {
          async.each(results, (user, callback) => {
            if (map.get(user.primaryEmail)) {
              map.get(user.primaryEmail).isInLDAP = true;
            }
            else {
              map.set(user.primaryEmail, {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isInMongo: false,
                isInLDAP: true,
                groups: user.groups,
                primaryEmail: user.primaryEmail
              });
            }
            callback();
          }, () => {
            callback();
          });
        });
      }
    ], () => {
      res.send(map.toArray());
    });
  });

  /**
   * Get groups list
   */
  app.get('/admin/api/groups', (req, res) => {
    GroupSchema.find().exec((err, results) => {
      if (err) {
        res.send(err);
      }
      else {
        res.send(_.map(results, (group) => {
          return group.groupName;
        }));
      }
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

  /**
   * Activate selected users
   */
  app.post('/admin/api/activate', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      user.locked = false;
      // maybe merge will be required
      user.groups = conf.ldap.user.defaultGroups;
      let userMongo = new UserSchema(user);
      userMongo.save(() => {
        callback();
      })
    }, () => {
      res.send({status: 'OK'});
    });
  });

  /**
   * Reset password for selected users
   */
  app.post('/admin/api/reset', (req, res) => {
    // TODO: implement this method
    res.send('Not implemented');
  });
};