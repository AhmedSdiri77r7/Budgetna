import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MailingService {
  constructor(private http: HttpClient) {}

  sendEmail(emailData: any) {
    // Envoyez la demande HTTP pour envoyer l'e-mail en utilisant l'API de mailing
    // Assurez-vous d'adapter cette méthode en fonction de l'API que vous utilisez
    return this.http.post('https://api.example.com/send-email', emailData);
  }
}
