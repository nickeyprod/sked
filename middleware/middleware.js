
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


module.exports.authorised = authorised;
module.exports.notAuthorised = notAuthorised;