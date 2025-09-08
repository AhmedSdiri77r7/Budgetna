import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  encrypt(plaintext: string, key: string): string {
    return CryptoJS.AES.encrypt(plaintext, key).toString();
  }

  decrypt(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
