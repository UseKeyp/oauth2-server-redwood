export const findAccount = (db) => async (ctx, sub) => {
  const account = await db.user.findUnique({
    where: { id: sub },
    select: { id: true, username: true, email: true },
  })
  // console.log('findAccount', account)
  if (!account) {
    // console.log('Account not found for id:', sub)
    return undefined
  }

  return {
    accountId: sub,
    claims: async (use, scope, claims, rejected) => {
      // console.log('claims', use, scope, claims, rejected)
      return {
        sub,
        email: account.email,
        email_verified: account.email_verified,
      }
    },
  }
}
