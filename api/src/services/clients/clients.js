import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'

const getAccessLevel = (developers) => {
  if (!developers) return 'NONE'
  const developer = developers.find(
    (developer) => developer.userId === context.currentUser.id
  )
  return developer.accessLevel
}

const validateEditAccess = (developers) => {
  if (!getAccessLevel(developers)) throw new Error('Unauthorized')
}

const validateOwnerAccess = (developers) => {
  if (!getAccessLevel(developers) !== 'OWNER') throw new Error('Unauthorized')
}

export const clients = async () => {
  const clients = await db.oidc.findMany({
    where: { developers: { some: { userId: context.currentUser.id } } },
    include: { developers: true },
  })
  return clients
    .filter((client) => !client.disabled)
    .map((client) => ({
      ...client,
      accessLevel: getAccessLevel(client.developers),
    }))
}

export const createClient = async () => {
  const client = await db.oidc.create({
    data: { type: 7, payload: { redirect_uris: [] } },
  })
  await db.clientsOnDevelopers.create({
    data: {
      user: { connect: { id: context.currentUser.id } },
      oidc: { connect: { id_type: { id: client.id, type: 7 } } },
      accessLevel: 'OWNER',
    },
  })
  return client
}

export const updateClient = async ({ id, redirectUrls }) => {
  const client = await db.oidc.findUnique({
    where: { id_type: { id, type: 7 } },
    select: { developers: true },
  })
  if (!client) throw new Error('Client not found')

  validateEditAccess(client.developers)
  const list = redirectUrls.split(',').map((url) => url.trim())
  // TODO validate list as https urls, or http for localhost
  return db.oidc.update({
    where: { id_type: { id, type: 7 } },
    data: { payload: { ...client.payload, redirect_uris: list } },
  })
}

export const deleteClient = async ({ id }) => {
  const client = await db.oidc.findUnique({
    where: { id_type: { id, type: 7 } },
    select: { developers: true },
  })
  if (!client) throw new Error('Client not found')
  validateOwnerAccess(client.developers)

  if (client.clientsOnDevelopers.accessLevel !== 'OWNER') {
    throw new Error('Unauthorized')
  }
  return db.oidc.update({
    where: { id, type: 7 },
    data: { disabled: true },
  })
}
