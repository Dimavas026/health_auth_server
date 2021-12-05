const { Schema, model } = require('mongoose')

const RolesSchema = new Schema({
  roles: { type: [String], required: true }
})

module.exports = model('Roles', RolesSchema)
