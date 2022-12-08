import { AuthenticationError } from '@redwoodjs/graphql-server'

import { CHESS } from 'src/lib/oAuth/providers/chess'
import { DISCORD } from 'src/lib/oAuth/providers/discord'

const APPROVED_LOGIN_PROVIDERS = [CHESS, DISCORD]

export const validateLoginRequest = ({ type }) => {
  if (!APPROVED_LOGIN_PROVIDERS.includes(type)) {
    throw new AuthenticationError(
      `OAuth provider "${type}" not available for login.`
    )
  }
}
