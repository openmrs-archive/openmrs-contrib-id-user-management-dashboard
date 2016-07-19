import UserSchema from './../../../../models/user';

UserSchema.find().exec(function(err, users) {
  console.log(users);
});