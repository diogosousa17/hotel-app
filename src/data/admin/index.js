const Admin = require('./admin')
const AdminService = require('./service')

const service = AdminService(Admin)

module.exports = service