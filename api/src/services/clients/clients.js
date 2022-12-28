import { db } from 'src/lib/db'

// Create client
export const createClient = async () => {
  const client = await db.oidc.create({
    data: { payload: { redirect_uris: [] } },
  })
  await db.clientsOnDevelopers.create({
    data: {
      oidcId: promotion.id,
      userId: context.currentUser.id,
      accessLevel: 'OWNER',
    },
  })
}

// Get client
export const clients = () => {
  return db.oidc.findMany({
    where: { clientsOnDevelopers: { userId: context.currentUser.id } },
  })
}

// Update Client redirect urls
export const updateClient = ({ id, redirectUrls }) => {
  // TODO: Ensure editor or owner permissions
  return db.oidc.update({
    where: { id, type: 'CLIENT' },
    data: { payload: { redirect_uris: redirectUrls } },
  })
}

// Delete client
export const deleteClient = ({ id }) => {
  // TODO: Ensure owner permissions
}
