import {
  oAuthChallenges,
  oAuthChallenge,
  createOAuthChallenge,
  updateOAuthChallenge,
  deleteOAuthChallenge,
} from './oAuthAuthority'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('oAuthChallenges', () => {
  scenario('returns all oAuthChallenges', async (scenario) => {
    const result = await oAuthChallenges()

    expect(result.length).toEqual(Object.keys(scenario.oAuthChallenge).length)
  })

  scenario('returns a single oAuthChallenge', async (scenario) => {
    const result = await oAuthChallenge({
      id: scenario.oAuthChallenge.one.id,
    })

    expect(result).toEqual(scenario.oAuthChallenge.one)
  })

  scenario('creates a oAuthChallenge', async () => {
    const result = await createOAuthChallenge({
      input: {
        state: 'String',
        code_challenge: 'String',
        client_id: 'String',
        scope: 'String',
        redirect_uri: 'String',
        response_type: 'String',
        code_challenge_method: 'String',
        updatedAt: '2022-12-09T03:44:26.202Z',
      },
    })

    expect(result.state).toEqual('String')
    expect(result.code_challenge).toEqual('String')
    expect(result.client_id).toEqual('String')
    expect(result.scope).toEqual('String')
    expect(result.redirect_uri).toEqual('String')
    expect(result.response_type).toEqual('String')
    expect(result.code_challenge_method).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2022-12-09T03:44:26.202Z'))
  })

  scenario('updates a oAuthChallenge', async (scenario) => {
    const original = await oAuthChallenge({
      id: scenario.oAuthChallenge.one.id,
    })
    const result = await updateOAuthChallenge({
      id: original.id,
      input: { state: 'String2' },
    })

    expect(result.state).toEqual('String2')
  })

  scenario('deletes a oAuthChallenge', async (scenario) => {
    const original = await deleteOAuthChallenge({
      id: scenario.oAuthChallenge.one.id,
    })
    const result = await oAuthChallenge({ id: original.id })

    expect(result).toEqual(null)
  })
})
