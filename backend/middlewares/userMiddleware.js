const jwt = require('jsonwebtoken')
const {getBearerToken} = require('../helpers')

module.exports = function (req, res, next) {
  const token = getBearerToken(req)

  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) req.user = user
    })
  }

  next()
}
