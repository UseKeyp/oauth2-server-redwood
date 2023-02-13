export const findAccount = (db) => async (ctx, sub) => {
  try {
    const account = await db.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        username: true,
        email: true,
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
        return {
          sub,
          email: account.email,
          username: account.username,
          ...(loginProvider && { provider: loginProvider }), // Can remove. Used for our internal testing
        }
      },
    }
  } catch (e) {
    console.log('findAccount error', e)
    return undefined
  }
}
