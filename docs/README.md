# ECIES

To encrypt an AES key to your **own** ECC key pair (self-encryption),
you use the **ECIES** (Elliptic Curve Integrated Encryption Scheme) protocol,
where you act as both the sender and the recipient.

The process effectively creates a secure "envelope" using an **ephemeral** key
pair generated specifically for this operation.

**Should use `X25519` algorithm for ECC encryption**

## 1. Generate an Ephemeral Key Pair

Create a temporary ECC key pair (`ephemeral_private`, `ephemeral_public`) using
the **same curve** (e.g., `secp256r1`, `secp256k1`) as your static key pair.

* *Why?* Using a fresh ephemeral key for every encryption ensures
  **semantic security**; encrypting the same AES key twice will produce
  different ciphertexts.

## 2. Derive the Shared Secret

Perform an **ECDH** (Elliptic Curve Diffie-Hellman) operation between:

*  Your **ephemeral private key**.
*  Your **static public key** (from your permanent key pair).
*  Result: A shared secret point on the curve.

## 3. Derive the AES Wrapping Key

Pass the shared secret through a **Key Derivation Function (KDF)**
(e.g., `HKDF-SHA256` or `Concatenation KDF`) to generate a symmetric AES key
(e.g., 256-bit).

* This derived key is mathematically distinct from your original AES key but is
  used solely to encrypt it.

## 4. Encrypt and Package
* __Encrypt__: Use the derived AES key to encrypt your target AES key
  (using a mode like **AES-GCM** or **AES-CBC**).
* __Package__: The final output must include:
    1. The **ephemeral public key** (unencrypted).
    2. The **encrypted AES key** (ciphertext).
    3. (Optional) The **IV/Nonce** and **Authentication Tag** if using an
       authenticated mode like GCM.

## Decryption Process

To retrieve the AES key later:

1. Extract the **ephemeral public key** from the package.
2. Perform **ECDH** using your **static private key** and the
   **ephemeral public key**. (Mathematically, `static_private * ephemeral_public`
   equals `ephemeral_private * static_public`).
3. Run the result through the same **KDF** to re-derive the AES wrapping key.
4. Decrypt the ciphertext to recover your original AES key.



-----------------------


The standard move is ephemeral-static ECDH (ECIES-shaped): generate a throwaway
keypair, ECDH its private against your static public, derive the AES-GCM key,
ship the ephemeral public key alongside the ciphertext, discard the ephemeral
private. That gives you a fresh key per message and doesn't pin everything to
one deterministic secret. The two-party check at the bottom (secrets agree: true)
is that same primitive with the ephemeral side kept around.

One caution on the deterministic path: a fixed AES-GCM key means you must
never reuse an (key, IV) pair, and since the key never rotates, a random
96-bit IV per message is doing all the nonce-uniqueness work. Fine at
low-to-moderate message volume; if you're encrypting a lot under that one
static key, prefer a counter-based nonce or rotate via HKDF info/salt
per message.
