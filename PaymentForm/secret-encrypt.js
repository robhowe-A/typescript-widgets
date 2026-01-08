//--Copyright (c) Robert A. Howell  2026

const secrets = {
    cryptography: {
        new: () => {
            return globalThis.crypto.subtle.generateKey( 
                {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
                }, true, ["encrypt", "decrypt"]);
        },
        encryptText: async (key, plaintext) => {
            let ciphertext = await globalThis.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, plaintext);
            
            return new Uint8Array(ciphertext);
        },
        exportKey: async (key) => {
            return await globalThis.crypto.subtle.exportKey("pkcs8", key);
        }
    },
    bus: {
        encrypt: (plaintext, ViewExampleElement, KeyName) => {
            if(
                plaintext == null || !plaintext.length > 0
            ) return;
    
            const a = ViewExampleElement;
    
            let enc = new TextEncoder();
    
            let text = secrets.cryptography.new();
            
            return text
                .then(keyPair => {
                    if(a === null) {
                        const storeKey = (async () => {
                            const KeyStorage = new Promise((resolve, reject) => {
                                return resolve(secrets.cryptography.exportKey(keyPair.privateKey));
                            });
                            KeyStorage.then(data => {
                                const exportedKey = new Uint8Array(data);
                                const keyPEM = `-----BEGIN PRIVATE KEY-----\n${exportedKey.toBase64()}\n-----END PRIVATE KEY-----`;
                                window.sessionStorage.setItem(KeyName, keyPEM);
                            });
                        })();
                        storeKey;
                    }
                    return secrets.cryptography.encryptText(keyPair.publicKey, enc.encode(plaintext))
                        .then(data => {
                            let dataBase64 = data.toBase64();
                            if(a !== null) {
                                a.textContent = dataBase64; return; }
                            
                            window.sessionStorage.setItem(`${KeyName}-ciphertext`, dataBase64.toString());
                            return data.toString();
                        });
                });
        },
    },
};

export default secrets;
