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
