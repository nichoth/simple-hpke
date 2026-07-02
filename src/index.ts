// Types + one config constant. FCIS-exempt: no runtime behavior.
import {
    CipherSuite,
    KEM_DHKEM_X25519_HKDF_SHA256,
    KDF_HKDF_SHA256,
    AEAD_AES_256_GCM
} from './vendor/hpke/index.js'

/**
 * Options for `seal` / `open`.
 */
export type HpkeOpts = {
    // Size of the GENERATED AES key. Ignored when an `aesKey` is supplied.
    keysize?:128|192|256
    // HPKE `info`: bound into the key schedule; must match on seal + open.
    info?:Uint8Array|string
}

/**
 * The one fixed HPKE cipher suite this package uses:
 * DHKEM(X25519, HKDF-SHA256) + HKDF-SHA256 + AES-256-GCM. Not configurable at
 * runtime. `seal` / `open` (added next) operate through it.
 */
export const suite = new CipherSuite(
    KEM_DHKEM_X25519_HKDF_SHA256,
    KDF_HKDF_SHA256,
    AEAD_AES_256_GCM
)
