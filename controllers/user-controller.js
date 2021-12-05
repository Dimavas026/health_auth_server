const userService = require('../services/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('./../exceptions/api-error')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(' ошибка валидации', errors.array()))
      }
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (e) {
      console.log('ошибка')
      next(e)
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async logout(req, res, next) {
    try {
      // const { refreshToken } = req.cookies
      // const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json('OKE')
    } catch (e) {
      next(e)
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
  async deleteUser(req, res, next) {
    try {
      const user = await userService.deleteUser(req.params.id)
      return res.status(200).json('OK')
    } catch (e) {
      next(e)
    }
  }
  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req.params.id)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async patchUser(req, res, next) {
    try {
      const user = await userService.patchUser(req.params.id, req.params.email, req.params.roles)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async getRoles(req, res, next) {
    try {
      const roles = await userService.getAllRoles()
      return res.json(roles)
    } catch (e) {
      next(e)
    }
  }
  async validateAuth(req, res, next) {
    try {
      return res.json('ok')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()