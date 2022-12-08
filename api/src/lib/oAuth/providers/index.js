import { CHESS, provider as chessProvider } from './chess'
import { onConnected as onConnectedChess } from './chess/login'
import { COINBASE, provider as coinbaseProvider } from './coinbase'
import { KEYP, provider as keypProvider } from './keyp'
// import { TWITCH, provider as twitchProvider } from './twitch'

export const providers = {
  [CHESS]: { ...chessProvider, onConnected: onConnectedChess },
  [COINBASE]: coinbaseProvider,
  [KEYP]: keypProvider,
  // [TWITCH]: twitchProvider,
}

export const types = [
  COINBASE,
  CHESS,
  KEYP,
  // TWITCH,
]
