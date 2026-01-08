//--Copyright (c) Robert A. Howell  2026

const secrets = {
    cryptography: {
        import: (keyBase64) => {
            return globalThis.crypto.subtle.importKey( 
                "pkcs8",
                keyBase64,
                    {
                name: "RSA-OAEP", 
                hash: "SHA-256"
                }, true, ["decrypt"]);
        },
        decryptText: async (decryptionKey, cipherBase64) => {

            const textToDecrypt = Uint8Array.fromBase64(cipherBase64);
            
            let plaintext = await globalThis.crypto.subtle.decrypt({ name: "RSA-OAEP" }, decryptionKey, textToDecrypt.buffer);

            const decoder = new TextDecoder();
            return decoder.decode(plaintext);
        }
    },
    bus: {
        decrypt: (key, cipherBase64) => {
            if( 
                key == null || cipherBase64 == null
            ) return;
            
            const importPEM = window.sessionStorage.getItem(key);
            
            const keyBase64 = Uint8Array.fromBase64(importPEM.split("\n")[1]);
            if (!keyBase64) {
                console.error("Key not found in sessionStorage");
                return;
            }
            
            let cryptoKey = secrets.cryptography.import(keyBase64);
            
            return cryptoKey
                .then( decryptionKey => {
                    return secrets.cryptography.decryptText(decryptionKey, cipherBase64)
                        .then(plaintext => plaintext);
                });
        },
    },
};

export default secrets;