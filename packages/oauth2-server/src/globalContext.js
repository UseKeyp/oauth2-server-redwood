import { AsyncLocalStorage } from 'async_hooks'

let GLOBAL_CONTEXT = {}
let PER_REQUEST_CONTEXT

export const shouldUseLocalStorageContext = () =>
  process.env.DISABLE_CONTEXT_ISOLATION !== '1'

/**
 * This returns a AsyncLocalStorage instance, not the actual store
 */
export const getAsyncStoreInstance = () => {
  if (!PER_REQUEST_CONTEXT) {
    PER_REQUEST_CONTEXT = new AsyncLocalStorage()
  }
  return PER_REQUEST_CONTEXT
}

export const createContextProxy = () => {
  if (shouldUseLocalStorageContext()) {
    return new Proxy(GLOBAL_CONTEXT, {
      get: (_target, property) => {
        const store = getAsyncStoreInstance().getStore()
        const ctx = store?.get('context') || {}
        return ctx[property]
      },
      set: (_target, property, newVal) => {
        const store = getAsyncStoreInstance().getStore()
        const ctx = store?.get('context') || {}
        ctx[property] = newVal
        store?.set('context', ctx)
        return true
      },
    })
  } else {
    return GLOBAL_CONTEXT
  }
}

export let context = createContextProxy()

/**
 * Set the contents of the global context object.
 */
export const setContext = (newContext) => {
  GLOBAL_CONTEXT = newContext
  if (shouldUseLocalStorageContext()) {
    // re-init the proxy against GLOBAL_CONTEXT,
    // so things like `console.log(context)` is the actual object,
    // not one initialized earlier.
    context = createContextProxy()
    const store = getAsyncStoreInstance().getStore()
    store?.set('context', GLOBAL_CONTEXT)
  } else {
    context = GLOBAL_CONTEXT
  }
  return context
}
