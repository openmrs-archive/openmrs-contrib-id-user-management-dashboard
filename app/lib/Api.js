'use strict';

let UserSchema = require('../../../../models/user');
let GroupSchema = require('../../../../models/group');
let ldap = require('../../../../ldap');
let conf = require('../../../../conf');

let async = require('async');
let _ = require('lodash');
let FastMap = require('collections/fast-map');

let mapFromDb = (user, fromMongo) => {
  let obj = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
  };
  if (fromMongo) {
    obj = _.extend(obj, {
      _id: user._id,
      groups: user.groups || [],
      emailList: user.emailList || [],
      locked: user.locked ? 'Yes' : 'No'
    });
  }
  return obj;
};

let mapToDb = (user) => {
  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    groups: user.groups,
    inLDAP: user.inLDAP === 'Yes',
    primaryEmail: user.primaryEmail,
    emailList: user.emailList,
    locked: user.locked === 'Yes'
  }
};

module.exports = (router) => {

  /**
   * Get users list
   */
  router.get('/users', (req, res) => {
    let map = new FastMap();
    async.parallel([
      function getMongoEntries(callback) {
        UserSchema.find().exec((err, results) => {
          if (err) {
            callback(err);
          }
          else {
            async.each(results, (user, callback) => {
              if (map.get(user.primaryEmail)) {
                map.get(user.primaryEmail).inMongo = 'Yes';
                map.get(user.primaryEmail).groups = user.groups;
                map.get(user.primaryEmail).emailList = user.emailList;
                map.get(user.primaryEmail).locked = user.locked ? 'Yes' : 'No';
              }
              else {
                let mappedUser = mapFromDb(user, true);
                mappedUser.inMongo = 'Yes';
                mappedUser.inLDAP = 'No';
                map.set(user.primaryEmail, mappedUser);
              }
              callback();
            }, () => {
              callback();
            });
          }
        });
      },
      function getLDAPEntries(callback) {
        ldap.getAllUsers((err, results) => {
          if (err) {
            callback(err);
          }
          else {
            // temporary - need to make PR into ID Dashboard
            results = _.reject(results, (user) => { return !user.primaryEmail });
            async.each(results, (user, callback) => {
              if (map.get(user.primaryEmail)) {
                map.get(user.primaryEmail).inLDAP = 'Yes';
              }
              else {
                let mappedUser = mapFromDb(user);
                mappedUser.inLDAP = 'Yes';
                mappedUser.inMongo = 'No';
                map.set(user.primaryEmail, mappedUser);
              }
              callback();
            }, () => {
              callback();
            });
          }
        });
      }
    ], (err) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        })
      }
      else {
        res.send({
          status: 'OK',
          data: map.toArray()
        });
      }
    });
  });

  /**
   * Get groups list
   */
  router.get('/groups', (req, res) => {
    GroupSchema.find().exec((err, results) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        });
      }
      else {
        res.send({
          status: 'OK',
          data: _.map(results, (group) => {
            return group.groupName;
          })
        });
      }
    });
  });

  /**
   * Update selected users
   */
  router.post('/users', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      UserSchema.findOne({
        _id: user._id
      }, (err, userMongo) => {
        if (err) {
          callback(err);
        }
        else {
          userMongo = _.extend(userMongo, mapToDb(user));
          userMongo.save((err) => {
            callback(err);
          });
        }
      });
    }, (err) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        })
      }
      else {
        res.send({status: 'OK'});
      }
    });
  });

  /**
   * Delete selected users
   */
  router.delete('/users', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      if (user.inMongo === 'Yes') {
        UserSchema.remove({
          _id: user._id
        }, (err) => {
          callback(err);
        });
      }
      else {
        ldap.deleteUser(user.username, (err) => {
          callback(err);
        })
      }
    }, (err) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        });
      }
      else {
        res.send({status: 'OK'});
      }
    });
  });

  /**
   * Add selected users to MongoDb/LDAP (fix missing MongoDb/LDAP entries)
   */
  router.post('/users/resave', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      if (user.inMongo == 'YES' && user._id) {
        UserSchema.findOne({
          _id: user._id
        }, (err, userMongo) => {
          if (err) {
            callback(err);
          }
          else {
            userMongo.save((err) => {
              callback(err);
            });
          }
        });
      }
      else {
        // TODO: re-implement it (first - get user from ldap, then - save to Mongo)
        let userMongo = new UserSchema(user);
        userMongo.save((err) => {
          callback(err);
        });
      }
    }, (err) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        })
      }
      else {
        res.send({status: 'OK'});
      }
    });
  });

  /**
   * Activate selected users
   */
  router.post('/activate', (req, res) => {
    let users = req.body.users;
    async.each(users, (user, callback) => {
      user.groups = _.concat(user.groups, conf.ldap.user.defaultGroups);
      UserSchema.findOne({
        _id: user._id
      }, (err, userMongo) => {
        if (err) {
          callback(err);
        }
        else {
          userMongo.locked = false;
          userMongo.save((err) => {
            callback(err);
          });
        }
      });
    }, (err) => {
      if (err) {
        res.send({
          status: 'ERR',
          error: err
        });
      }
      else {
        res.send({status: 'OK'});
      }
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