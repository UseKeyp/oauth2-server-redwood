export const findAccount = (db) => async (ctx, sub) => {
  try {
    const account = await db.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
      },
    })

    if (!account) {
      // console.log('Account not found for id:', sub)
      return undefined
    }

    return {
      accountId: sub,
      claims: async (use, scope, claims, rejected) => {
        // console.log('claims', use, scope, claims, rejected)
        // TODO return claims based on use, scope, claims, rejected
        // use: userinfo
        // scope: openid, email
        return {
          sub,
          username: account.username,
          email: account.email,
          address: account.address,
        }
      },
    }
  } catch (e) {
    console.log('findAccount error', e)
    return undefined
  }
}
