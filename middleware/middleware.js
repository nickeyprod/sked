
function authorised(req, res, next) {
  if(req.session && req.session.userId) {
    return next();
  } else {
    var error = new Error("Вы не авторизованы");
    return next(error);
  }
}

function notAuthorised(req, res, next) {
  if(req.session && req.session.userId) {
    return res.redirect("/");
  } else {
    return next();
  }
}

function isAdmin(req, res, next) {
  if(req.session && req.session.userId && req.session.admin) {
    return next();
  } else {
    const error = new Error("You cannot pass, bad bot"); 
    error.status = 403;
    return next(error);
  }
}


module.exports.authorised = authorised;
module.exports.notAuthorised = notAuthorised;
module.exports.isAdmin = isAdmin;