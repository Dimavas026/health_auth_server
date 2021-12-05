module.exports = class TokenDto {
  id
  refreshToken

  constructor(model) {
    this.refreshToken = model.refreshToken
    this.id = model._id
  }
}