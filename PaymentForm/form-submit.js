//--Copyright (c) Robert A. Howell  2026

import secrets from "/secret-encrypt.js";

const SecureForm = { 
    Initialize: (OutputElement) => {
        document.forms.PIF.addEventListener("submit", async (e) => {
            e.preventDefault();
    
            document.forms.PIF.style.display = "none";
            const formdata = new FormData(e.currentTarget);

            const nameVal = formdata.get("cardholder-name");
            const numberVal = formdata.get("credit-number");
            const codeVal = formdata.get("card-verification-number");
            const monthVal = formdata.get("card-expiration-month");
            
            const chnInput = document.querySelector('input[name="cardholder-name"]');
            const ccnInput = document.querySelector('input[name="credit-number"]');
            const cvvInput = document.querySelector('input[name="card-verification-number"]');
            const cemInput = document.querySelector('input[name="card-expiration-month"]');
            chnInput.remove();
            ccnInput.remove();
            cvvInput.remove();
            cemInput.remove();
    
            const secretNameInput = document.forms.PIF.insertAdjacentElement('afterbegin', document.createElement("input"));
            secretNameInput.name = "cardholder-name";
            secretNameInput.value = await secrets.bus
                .encrypt(nameVal, null, "encrypted-name");
    
            const secretCardNumberInput = document.forms.PIF.insertAdjacentElement("afterbegin", document.createElement("input"));
            secretCardNumberInput.name = "credit-number";
            secretCardNumberInput.value = await secrets.bus
                .encrypt(numberVal, null, "encrypted-number");
    
            const secretCvvInput = document.forms.PIF.insertAdjacentElement("afterbegin", document.createElement("input"));
            secretCvvInput.name = "card-verification-number";
            secretCvvInput.value = await secrets.bus
                .encrypt(codeVal, null, "encrypted-code");
    
            const secretEmInput = document.forms.PIF.insertAdjacentElement("afterbegin", document.createElement("input"));
            secretEmInput.name = "card-expiration-month";
            secretEmInput.value = await secrets.bus
                .encrypt(monthVal, null, "encrypted-month");
    
            e.target.submit();
        })
    }
};

export default SecureForm;
