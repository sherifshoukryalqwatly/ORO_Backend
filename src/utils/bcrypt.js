import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
 import fs from 'fs'

 const publicKey = fs.readFileSync('publicKey.pem',"utf8");
 const privateKey = fs.readFileSync('privateKey.pem',"utf8");
 console.log("✅ Keys generated!");

 function encryptRSA(text) {
    if (!text) throw new Error("No text provided for encryption");
    console.log("Text to encrypt:", text);

    try {
        const encryptedBuffer = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(text, "utf8")
        );
        return encryptedBuffer.toString("base64");
    } catch (error) {
        console.error("RSA encryption failed:", error.message);
        return null;
    }
}


// Decrypt
function decryptRSA(encryptedBase64) {
  try {
    console.log("Text to decrypt:", encryptedBase64);
    return crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedBase64, "base64")
    ).toString("utf8");
  } catch (error) {
    console.error("RSA decryption failed:", error.message);
    return null; // Return null instead of crashing
  }
}


export { encryptRSA, decryptRSA };