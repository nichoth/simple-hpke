import Debug from '@substrate-system/debug'
const debug = Debug('ecies')

const crypto = globalThis.crypto.subtle

export function example ():void {
    debug('hello')
}
