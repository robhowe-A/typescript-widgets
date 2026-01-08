//--Copyright (c) Robert A. Howell  2026

import secrets from "/secret-encrypt.js";
import SecureForm from '/form-submit.js';

(() => {
    const IMPSEL = document.forms.PIF.querySelector("#PIFIM");

    SecureForm.Initialize(IMPSEL);
    
    const PIFELS = document.forms.PIF.querySelectorAll("fieldset input[data-validate]");
    const PSEL = document.forms.PIF.querySelector("#PIFS");

    const updateOutput = (e) => {
        let a,b = Object;

        if(e instanceof InputEvent || e instanceof Event){
            e.preventDefault();
            a = e.target;
        }
        else a = e;

        switch(a.dataset.validate) {
            case "name":
                b = PSEL.querySelector('[data-id="validated-name"]').textContent = a.value;

                secrets.bus.encrypt(a.value, IMPSEL.querySelector('[data-id="encrypted-name"]'), "encrypted-name");

                break;
            case "number":
                b = PSEL.querySelector('[data-id="validated-number"]').textContent = a.value;

                secrets.bus.encrypt(a.value, IMPSEL.querySelector('[data-id="encrypted-number"]'), "encrypted-number");

                break;
            case "code":
                b = PSEL.querySelector('[data-id="validated-code"]').textContent = a.value;

                secrets.bus.encrypt(a.value, IMPSEL.querySelector('[data-id="encrypted-code"]'), "encrypted-code");

                break;
            case "month":
                b = PSEL.querySelector('[data-id="validated-month"]').textContent = a.value;

                secrets.bus.encrypt(a.value, IMPSEL.querySelector('[data-id="encrypted-month"]'), "encrypted-month");

                break;
        }
        if (b == null) console.error("Element not verified.");
    }

    PIFELS.forEach(i => {
        updateOutput(i);
        i.addEventListener("input", updateOutput);
    });
})();
