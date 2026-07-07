import { i2osp, concat } from './util.js'

// RFC 9180 suite identifiers for the one suite this package implements:
// DHKEM(X25519, HKDF-SHA256) = 0x0020, HKDF-SHA256 = 0x0001,
// AES-256-GCM = 0x0002.
export const KEM_ID = 0x0020
export const KDF_ID = 0x0001
export const AEAD_ID = 0x0002

// Lengths (bytes). Nsecret/Nk/Nh follow SHA-256; Nn/Nenc/tag are the
// AES-256-GCM nonce, X25519 encapsulated-key, and GCM tag sizes.
export const NSECRET = 32
export const NK = 32
export const NN = 12
export const ENC_LENGTH = 32
export const AEAD_TAG_LENGTH = 16

// HPKE base mode.
export const MODE_BASE = 0x00

export const HPKE_V1 = new TextEncoder().encode('HPKE-v1')

// Length of the encrypt/decrypt length prefix, in bytes. The prefix is a
// big-endian u16 giving the byte length of the `wrapped` segment, which
// varies with the wrapped AES key size (64 bytes for 128-bit, 80 for 256).
export const WRAPPED_LEN_PREFIX = 2

// suite_id for KEM labeled calls: "KEM" || I2OSP(kem_id, 2).
export const KEM_SUITE_ID = concat(
    new TextEncoder().encode('KEM'),
    i2osp(KEM_ID, 2)
)

// suite_id for key-schedule labeled calls:
// "HPKE" || I2OSP(kem_id, 2) || I2OSP(kdf_id, 2) || I2OSP(aead_id, 2).
export const HPKE_SUITE_ID = concat(
    new TextEncoder().encode('HPKE'),
    i2osp(KEM_ID, 2),
    i2osp(KDF_ID, 2),
    i2osp(AEAD_ID, 2)
)
