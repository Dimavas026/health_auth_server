const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('./../dtos/user-dto')
const TokenDto = require('./../dtos/token-dto')
const ApiError = require('../exceptions/api-error');
const uuid = require('uuid')
const tokenModel = require('./../models/token-model');
const RolesModel = require('../models/roles-model')
const { mongoose } = require('mongoose')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })

    if (candidate) {
      throw ApiError.BadRequest(`пользователь с адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await UserModel.create(({ email, password: hashPassword, activationLink, roles: ['user'] }))
    // await mailService.sendActivationMail(email, activationLink)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    // const tokenData = await tokenModel.findOne({ user: userDto.id })
    // const tokenDto = new TokenDto(tokenData)
    // const b = 123;
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw new ApiError.BadRequest('is not correct')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new ApiError.BadRequest(' пользователь с таким емейл не найден ')
    }
    const isPassEqual = await bcrypt.compare(password, user.password)
    if (!isPassEqual) {
      throw ApiError.BadRequest((' неверный пароль '))
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    // const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData) {
      throw ApiError.BadRequest()
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    // await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }

  async getAllUsers() {
    const users = await UserModel.find()
    return users
  }

  async deleteUser(id) {
    return UserModel.findByIdAndRemove(id);
  }

  async getUser(id) {
    const user = UserModel.findById(id);
    return user
  }

  async patchUser(id, email, roles) {
    const user = UserModel.findByIdAndUpdate(id, { email, roles });
    return user
  }

  async getAllRoles() {
    const roles = await RolesModel.find()
    return roles
  }
}

module.exports = new UserService()