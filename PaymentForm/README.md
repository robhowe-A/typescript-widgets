<!--Copyright (c) Robert A. Howell  2026
Folder_Name: PaymentForm
Author: Robert Howell
Description: Demonstrates card payment encryption and decryption methods in application-layer encryption architecture. This demonstration uses an HTML form, JavaScript event handling, and browser cryptography.
  Comment: Jet Brains Rider AI Assistant was used to troubleshoot the creation of this example.
  Warning: This is not a production implementation. It is not recommended to develop your own payment scheme environment without a good security reason to do so.
Date: 2026-01-07
Edited: 2026-01-08
-->

# Features  
This folder holds the source code demonstrating a card payment used in the browser.  

Running the code demonstrates secure data encryption and decryption. A user enters their payment information and returns to see the data decrypted.  

## Details  
1. JavaScript handles form submission, encryption, and decryption
2. RSA-OAEP encryption and decryption
3. See your encrypted ciphertext revealed in the gold-bordered output
    >Hint: Cryptograms are produced by submitting the form and consumed after transmit
4. Form validation filters the cardholder data inputs

### Descriptoin and Use Cases  
Enter any card information and click 'Submit'. You're taken to the next page showing the data decrypted. Form data is encrypted and submitted. It is decrypted at the next page.  

Secure cryptograms are transmitted via browser session API. Browser cryptography implements encryption and decryption. There are no networked servers, so, the browser simulates the data transfer in place of a networked server.  

## Architecture  
The browser encrypts and decrypts payment information. This architecture demonstrates client cryptography, which can be used in applications like payment processors, federated applications or even service workers.  

Cryptography functions use globalThis and transmit data uses window. In real practice, 'globalThis' is an interchangeable moniker for 'window'.  

### globalThis calls cryptographic functions  
//encryption function called  
~~~ Javascript
globalThis.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, plaintext);
~~~

### window transmits encrypted data keys  
//window session is the transmit medium  
~~~ Javascript
window.sessionStorage.setItem(KeyName, PEMKey);
~~~

As shown above, from the code, the session storage holds the decryption key.  

**SECURITY NOTE:**  
-A secret key is not securely generated on a client system in secure environments  
-Because there is no server, the private key would be available to intercept with XSS (cross-site-scripting) and the browser debugger  

Please note: Transport encryption is not the same as application layer encryption. Merely because a page is encrypted does not mean your data is being protected and handled securely.  

## Delve into the code  

### Key pair generation  
//generate a key pair  
~~~ JavaScript
globalThis.crypto.subtle.generateKey( 
    {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, true, ["encrypt", "decrypt"]);
~~~

### Key export  
//store the encryption key later decryption  
~~~ JavaScript
const KeyStorage = new Promise((resolve, reject) => {
     return resolve(secrets.cryptography.exportKey(keyPair.privateKey));
 });
~~~

### Example encryption  
//example output shows example ciphertext  
~~~ JavaScript
case "number":
b = PSEL.querySelector('[data-id="validated-number"]').textContent = a.value;

secrets.bus.encrypt(a.value, IMPSEL.querySelector('[data-id="encrypted-number"]'), "encrypted-number");

break;
~~~
