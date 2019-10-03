import { Input, Transform, Output } from 'chrome-native-messaging'
import { messageHandler } from './lib'

process.stdin
  .pipe(new Input())
  .pipe(new Transform(messageHandler))
  .pipe(new Output())
  .pipe(process.stdout)
