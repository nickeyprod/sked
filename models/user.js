const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
});

//create register new user function
UserSchema.statics.registerNew = function(userData, callback) {
  //hash password
  bcrypt.hash(userData.pass, 10, function(err, hashedPass) {
    if(err) {
      return callback(err);
    }
    //create object from body data
    var usrData = {
      username: userData.username,
      password: hashedPass,
    };
    mongoose.model('User', UserSchema).create(usrData, function(err, user) {
      if(err || !user) {
        return callback(err);
      }
      return callback(null, user);
    });
  });
}

//create authorize function
UserSchema.statics.authorize = function(username, password, callback) { 
  mongoose.model('User', UserSchema).findOne({username: username})
    .exec(function(err, user) {
      if(err || !user) {
        if(!user) {
          var error = new Error("User not found");
          error.statusCode = 500;
          return callback(error);
        }
        var error = new Error("Error during authorization");
        error.statusCode = 500;
        return callback(error);
      }
      bcrypt.compare(password, user.password, function(error, result){
        if(result === true) {
          return callback(null, user);
        } else {
          var error = new Error("Wrong password");
          return callback(error, user);
        }
      });
    });
}

//create changepass function
UserSchema.statics.changePass = function(oldPass, email, newPass, callback) {
  mongoose.model('User', UserSchema).findOne({email: email})
    .exec(function(err, user) {
      if(err || !user) {
        return callback(err);
      }
      bcrypt.compare(oldPass, user.password, function(err, result){
        if(err) {
          return callback(err, null);
        }
        if(result === true) {
          //hash new password
          bcrypt.hash(newPass, 10, function(err, hashedPass) {
            if(err) {
              return callback(err, null);
            }
            user.password = hashedPass;
            user.save(function(err) {
              if(err) {
                return callback(err, null);
              }
              return callback(null, true);
            });
          });
        } 
        else {
          return callback(null, false);
        }
      });
    });
}

module.exports = mongoose.model('User', UserSchema);