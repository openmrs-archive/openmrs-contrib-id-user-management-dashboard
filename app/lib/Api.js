'use strict';

let UserSchema = require('../../../../models/user');
let GroupSchema = require('../../../../models/group');
let ldap = require('../../../../ldap');
let conf = require('../../../../conf');

let async = require('async');
let _ = require('lodash');
let FastMap = require('collections/fast-map');

module.exports = (router) => {

  /**
   * Get users list
   */
  router.get('/users', (req, res) => {
    let map = new FastMap();
    async.parallel([
      function getMongoEntries(callback) {
        UserSchema.find().exec((err, results) => {
          async.each(results, (user, callback) => {
            if (map.get(user.primaryEmail)) {
              map.get(user.primaryEmail).inMongo = 'Yes';
            }
            else {
              map.set(user.primaryEmail, {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                inMongo: 'Yes',
                inLDAP: 'No',
                groups: user.groups,
                primaryEmail: user.primaryEmail,
                emailList: user.emailList,
                locked: user.locked ? 'Yes' : 'No'
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
          // temporary - need to make PR into ID Dashboard
          results = _.reject(results, (user) => { return !user.primaryEmail });
          async.each(results, (user, callback) => {
            if (map.get(user.primaryEmail)) {
              map.get(user.primaryEmail).inLDAP = 'Yes';
            }
            else {
              map.set(user.primaryEmail, {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                inMongo: 'No',
                inLDAP: 'Yes',
                groups: user.groups,
                primaryEmail: user.primaryEmail,
                emailList: user.emailList,
                locked: user.locked ? 'Yes' : 'No'
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
  router.get('/groups', (req, res) => {
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
   * Update selected users
   */
  router.post('/users', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      UserSchema.update({
        _id: user._id
      }, user, (err) => {
        // TODO: add error handler
        callback();
      });
    }, () => {
      res.send({status: 'OK'});
    });
  });

  /**
   * Delete selected users
   */
  router.delete('/users', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      if (user.inMongo) {
        UserSchema.remove({
          _id: user._id
        }, (err) => {
          // TODO: add error handler
          callback();
        });
      }
      else {
        ldap.deleteUser(user.username, (err) => {
          // TODO: add error handler
          callback();
        })
      }
    }, () => {
      res.send({status: 'OK'});
    });
  });

  /**
   * Add selected users to MongoDb/LDAP (fix missing MongoDb/LDAP entries)
   */
  router.post('/users/resave', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      if (user.inMongo && user._id) {
        UserSchema.update({
          _id: user._id
        }, user, (err) => {
          // TODO: add error handler
          callback();
        });
      }
      else {
        let userMongo = new UserSchema(user);
        userMongo.save(() => {
          callback();
        })
      }
    }, () => {
      res.send({status: 'OK'});
    });
  });

  /**
   * Activate selected users
   */
  router.post('/activate', (req, res) => {
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
  router.post('/reset', (req, res) => {
    // TODO: implement this method
    res.send('Not implemented');
  });
};