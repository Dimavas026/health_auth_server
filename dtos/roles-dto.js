module.exports = class RolesDto {
  id
  roles

  constructor(model) {
    this.roles = model.roles
    this.id = model._id
  }
}