import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  rootUri = `${environment.apiEndPoint}/users/`;

  constructor(private http: HttpClient) {}

  // création d'un utilisateur
  createUser(user: any) {
    return this.http.post(this.rootUri, user).toPromise();
  }

  // récupération d'un utilisateur par nom d'utilisateur et mot de passe
  getUserbyUsernameAndPassword(username: string, password: string) {
    return this.http.post(this.rootUri + 'auth', { username, password }).toPromise();
  }

  // récupération d'un utilisateur par token JWT
  getUserbyToken(token: string) {
    return this.http.post(this.rootUri + 'auth0', { token }).toPromise();
  }

  // vérification disponibilité d'un nom d'utilisateur
  verifyIfUsernameIsAvailable(username: string) {
    return this.http.post(this.rootUri + 'check', { username }).toPromise();
  }

  // envoi d'un code de sécurité par mail à l'utilisateur
  sendResetCode(username: string) {
    return this.http.post(this.rootUri + 'askResetCode', { username }).toPromise();
  }

  // mise à jour du mot de passe
  updatePassword(username: string, password: string, code: number) {
    return this.http.put(this.rootUri + 'updatePassword', { username, password, code }).toPromise();
  }
}
