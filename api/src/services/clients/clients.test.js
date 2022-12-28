import {
  clients,
  clientsOnDevelopers,
  createClientsOnDevelopers,
  updateClientsOnDevelopers,
  deleteClientsOnDevelopers,
} from './clients'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('clients', () => {
  scenario('returns all clients', async (scenario) => {
    const result = await clients()

    expect(result.length).toEqual(
      Object.keys(scenario.clientsOnDevelopers).length
    )
  })

  scenario('returns a single clientsOnDevelopers', async (scenario) => {
    const result = await clientsOnDevelopers({
      id: scenario.clientsOnDevelopers.one.id,
    })

    expect(result).toEqual(scenario.clientsOnDevelopers.one)
  })

  scenario('creates a clientsOnDevelopers', async (scenario) => {
    const result = await createClientsOnDevelopers({
      input: {
        updatedAt: '2022-12-28T17:01:50.640Z',
        userId: scenario.clientsOnDevelopers.two.userId,
        oidcId: scenario.clientsOnDevelopers.two.oidcId,
        accessLevel: 'OWNER',
      },
    })

    expect(result.updatedAt).toEqual(new Date('2022-12-28T17:01:50.640Z'))
    expect(result.userId).toEqual(scenario.clientsOnDevelopers.two.userId)
    expect(result.oidcId).toEqual(scenario.clientsOnDevelopers.two.oidcId)
    expect(result.accessLevel).toEqual('OWNER')
  })

  scenario('updates a clientsOnDevelopers', async (scenario) => {
    const original = await clientsOnDevelopers({
      id: scenario.clientsOnDevelopers.one.id,
    })
    const result = await updateClientsOnDevelopers({
      id: original.id,
      input: { updatedAt: '2022-12-29T17:01:50.640Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2022-12-29T17:01:50.640Z'))
  })

  scenario('deletes a clientsOnDevelopers', async (scenario) => {
    const original = await deleteClientsOnDevelopers({
      id: scenario.clientsOnDevelopers.one.id,
    })
    const result = await clientsOnDevelopers({ id: original.id })

    expect(result).toEqual(null)
  })
})
