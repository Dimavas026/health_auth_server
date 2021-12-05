const nodemailer = require('nodemailer')

class MailService {
  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     host
  //   })
  // }
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: '',// моя почта,
      to: '',// кому,
      subject: '',// ntvf
      text: '',
      html:
      `
        <div>
          <h1>go to link</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    })
  }
}

module.exports = new MailService()