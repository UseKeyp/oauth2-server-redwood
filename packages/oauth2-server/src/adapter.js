// Adapted from https://github.com/panva/node-oidc-provider/blob/main/example/adapters/contributed/prisma.ts
// Adapter interface: https://github.com/panva/node-oidc-provider/blob/main/example/my_adapter.js

const types = [
  'OidcModels',
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'ClientCredentials',
  'Client',
  'InitialAccessToken',
  'RegistrationAccessToken',
  'Interaction',
  'ReplayDetection',
  'PushedAuthorizationRequest',
  'Grant',
  'BackchannelAuthenticationRequest',
  'Session',
].reduce((map, name, i) => ({ ...map, [name]: i + 1 }), {})

const prepare = (doc) => {
  const isPayloadJson =
    doc.payload &&
    typeof doc.payload === 'object' &&
    !Array.isArray(doc.payload)

  const payload = isPayloadJson ? doc.payload : {}

  return {
    ...payload,
    ...(doc.consumedAt ? { consumed: true } : undefined),
  }
}

const expiresAt = (expiresIn) =>
  expiresIn ? new Date(Date.now() + expiresIn * 1000) : null

const getAdapter = (db) => {
  return (name) => {
    const type = types[name]
    return {
      upsert: async (id, payload, expiresIn) => {
        const data = {
          type,
          payload: payload,
          grantId: payload.grantId,
          userCode: payload.userCode,
          uid: payload.uid,
          expiresAt: expiresAt(expiresIn),
        }

        await db.oidc.upsert({
          where: { id_type: { id, type } },
          update: { ...data },
          create: { id, ...data },
        })
      },

      find: async (id) => {
        // console.log(`find ${name} (${type}): ${id}`)
        const doc = await db.oidc.findUnique({
          where: { id_type: { id, type } },
        })

        if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
          return undefined
        }

        return prepare(doc)
      },

      findByUserCode: async (userCode) => {
        const doc = await db.oidc.findFirst({ where: { userCode } })

        if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
          return undefined
        }

        return prepare(doc)
      },

      findByUid: async (uid) => {
        const doc = await db.oidc.findUnique({ where: { uid } })

        if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
          return undefined
        }

        return prepare(doc)
      },

      consume: async (id) => {
        await db.oidc.update({
          where: { id_type: { id, type } },
          data: { consumedAt: new Date() },
        })
      },

      destroy: async (id) => {
        try {
          await db.oidc.delete({ where: { id_type: { id, type } } })
        } catch (e) {
          // TODO: throw if not type RecordNotFound
          // console.log(e.code)
          // console.log(e.type)
          // console.log(e)
        }
      },

      revokeByGrantId: async (grantId) => {
        await db.oidc.deleteMany({ where: { grantId } })
      },
    }
  }
}
export default getAdapter
