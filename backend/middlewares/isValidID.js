const { isValidObjectId}  = require('mongoose')

module.exports = (req, res, next) => {
  if (isValidObjectId(req.params.id)) {
    return next()    
  } else {
    res.status(400);
    throw new Error('Not valid ID:', req.params.id)
  }

}