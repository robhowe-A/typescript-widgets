//--Copyright (c) Robert A. Howell  2026

import secrets from "./secret-decrypt.js";

( async () => {
    
    const keys = [
        ["encrypted-name-ciphertext","encrypted-name","decrypted-name"],
        ["encrypted-number-ciphertext","encrypted-number","decrypted-number"],
        ["encrypted-code-ciphertext","encrypted-code","decrypted-code"],
        ["encrypted-month-ciphertext","encrypted-month","decrypted-month"],
    ];

    const decrypted = document.getElementById("decrypted");
    const PIFS = document.getElementById("PIFS");
    
    for (let key of keys) {
        
        const cipherBase64 = window.sessionStorage.getItem(key[0]);
        if (!cipherBase64) throw new Error("Ciphertext not found");
        
        let decryptedtext = await secrets.bus.decrypt(key[1], cipherBase64);
    
        const elem = PIFS.querySelector(`span [data-id="${key[2]}"]`);
        elem.textContent = decryptedtext;
        
    }
})();




