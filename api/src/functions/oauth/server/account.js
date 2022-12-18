import { getCurrentUser, isAuthenticated } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const assert = require('assert')

class Account {
  // This interface is required by oidc-provider
  static async findAccount(ctx, id) {
    // This would ideally be just a check whether the account is still in your storage
    const account = await db.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true },
    })

    if (!account) {
      return undefined
    }

    return {
      accountId: id,
      // and this claims() method would actually query to retrieve the account claims
      async claims() {
        return {
          sub: id,
          email: account.email,
          email_verified: account.email_verified,
        }
      },
    }
  }

  static async authenticate() {
    try {
      const account = context.currentUser
      assert(account, 'invalid credentials provided')
      return account.id
    } catch (err) {
      return undefined
    }
  }
}

module.exports = Account
