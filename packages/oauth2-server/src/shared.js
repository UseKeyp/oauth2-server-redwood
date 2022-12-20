import CryptoJS from 'crypto-js'

// Extracts the cookie from an event, handling lower and upper case header names.
const eventHeadersCookie = (event) => {
  return event.headers.cookie || event.headers.Cookie
}

// When in development environment, check for cookie in the request extension headers
// if user has generated graphiql headers
const eventGraphiQLHeadersCookie = (event) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const jsonBody = JSON.parse(event.body ?? '{}')
      return (
        jsonBody?.extensions?.headers?.cookie ||
        jsonBody?.extensions?.headers?.Cookie
      )
    } catch {
      // sometimes the event body isn't json
      return
    }
  }

  return
}

// Extracts the session cookie from an event, handling both
// development environment GraphiQL headers and production environment headers.
export const extractCookie = (event) => {
  return eventGraphiQLHeadersCookie(event) || eventHeadersCookie(event)
}

// decrypts the session cookie and returns an array: [data, csrf]
export const decryptSession = (text) => {
  if (!text || text.trim() === '') {
    return []
  }
  console.log('decryptSession', text)
  try {
    const decoded = CryptoJS.AES.decrypt(
      text,
      process.env.SESSION_SECRET
    ).toString(CryptoJS.enc.Utf8)
    const [data, csrf] = decoded.split(';')
    const json = JSON.parse(data)
    console.log(json)
    return [json, csrf]
  } catch (e) {
    throw new Error('Session Decrypt Error')
  }
}

// returns the actual value of the session cookie
export const getSession = (text) => {
  console.log('getSession', text)
  if (typeof text === 'undefined' || text === null) {
    return null
  }

  const cookies = text.split(';')
  const sessionCookie = cookies.find((cook) => {
    return cook.split('=')[0].trim() === 'session'
  })

  if (!sessionCookie || sessionCookie === 'session=') {
    return null
  }

  return sessionCookie.split('=')[1].trim()
}

// Convenience function to get session, decrypt, and return session data all
// at once. Accepts the `event` argument from a Lambda function call.
export const dbAuthSession = (event) => {
  if (extractCookie(event)) {
    const [session, _csrfToken] = decryptSession(
      getSession(extractCookie(event))
    )
    return session
  } else {
    return null
  }
}

export const webAuthnSession = (event) => {
  if (!event.headers.cookie) {
    return null
  }

  const webAuthnCookie = event.headers.cookie.split(';').find((cook) => {
    return cook.split('=')[0].trim() === 'webAuthn'
  })

  if (!webAuthnCookie || webAuthnCookie === 'webAuthn=') {
    return null
  }

  return webAuthnCookie.split('=')[1].trim()
}

// hashes a password using either the given `salt` argument, or creates a new
// salt and hashes using that. Either way, returns an array with [hash, salt]
export const hashPassword = (text, salt) => {
  const useSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString()

  return [
    CryptoJS.PBKDF2(text, useSalt, { keySize: 256 / 32 }).toString(),
    useSalt,
  ]
}
