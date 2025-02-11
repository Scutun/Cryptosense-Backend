const bcrypt = require('bcrypt')

class UsersService {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    dateNow() {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${day}-${month}-${year}`
        return formattedDate
    }
}

module.exports =new UsersService()