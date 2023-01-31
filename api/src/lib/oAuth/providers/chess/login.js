import { logger } from 'src/lib/logger'

export const onConnected = async ({ decoded }) => {
  try {
    if (!decoded) return null
    /* eslint-disable camelcase */
    logger.debug({ custom: decoded }, 'onConnected() decoded')
    return { username: 'bob', id: 123 }
  } catch (e) {
    logger.error(e)
    throw `onConnected() error`
  }
}
