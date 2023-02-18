import crypto from "crypto-js";
import elliptic from "elliptic";
import type { DataState } from "../app/modules/formSlice";
import readFile from "./readFile";

export function generateSecrets(
  sharedSecretSetter: React.Dispatch<React.SetStateAction<string>>,
  macKeySetter: React.Dispatch<React.SetStateAction<string>>
) {
  // Initialize elliptic curve and generate key pair objects for client and mock server
  const ec = new elliptic.ec("secp256k1");
  const clientKeyPair = ec.genKeyPair();
  const serverKeyPair = ec.genKeyPair();

  // Derive shared secret from server public key (deriving with serverKeyPair.derive(serverKeyPair...) must deliver the same sharedKey)
  const sharedSecret = clientKeyPair
    .derive(serverKeyPair.getPublic())
    .toString("hex");
  // console.log("sharedSecret: ", sharedSecret);

  // Derive MAC key from shared secret
  const salt = "macKey";
  const macKey = crypto.PBKDF2(sharedSecret, salt).toString();
  // console.log("macKey: ", macKey);

  sharedSecretSetter(sharedSecret);
  macKeySetter(macKey);
}

export async function generateRequestBody(
  data: DataState,
  sharedSecret: string,
  macKey: string
) {
  // Deep-copy data object
  const dataObject = JSON.parse(JSON.stringify(data)) as DataState;

  // Read document file
  await readFile(dataObject);
  // console.log("dataObject: ", dataObject);

  // Encrypt data object
  const encryptedData = crypto.AES.encrypt(
    JSON.stringify(dataObject),
    sharedSecret
  ).toString();
  // console.log("Encrypted: ", encryptedData);

  /*
   * // Decryption check
   * const decryptedForm = crypto.AES.decrypt(encryptedData, sharedSecret);
   * console.log(
   *   "Decripted: ",
   *   JSON.parse(decryptedForm.toString(crypto.enc.Utf8))
   * );
   */

  // Generate MAC (Message Authentication Code)
  const mac = crypto.HmacSHA256(encryptedData, macKey).toString();
  // console.log("mac: ", mac);

  // Generate requestBody
  const requestBody = JSON.stringify({
    encryptedData: encryptedData,
    mac: mac,
  });
  // console.log("requestBody: ", requestBody);

  return requestBody;
}
