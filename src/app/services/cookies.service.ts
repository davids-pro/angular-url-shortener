import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor(private cookieService: CookieService) {}

  // vérification présence cookie, retourne un booléen
  checkCookie(name: string) {
    return this.cookieService.check(name);
  }

  // lecture contenu du cookie et le retourn
  getCookie(name: string) {
    return this.cookieService.get(name);
  }

  // retourne tous les cookies du domaine
  getAllCookies() {
    return this.cookieService.getAll();
  }

  // enregistrement du cookie
  setCookie(name: string, value: string, days: number) {
    this.cookieService.set(name, value, days, '/', environment.cookieDomain, environment.cookieSecure, environment.cookieSameSite);
  }

  // suppression du cookie par nom
  deleteCookie(name: string) {
    this.cookieService.delete(name, '/', environment.cookieDomain);
  }

  // suppression de tous les cookies
  deleteAllCookies() {
    this.cookieService.deleteAll('/', environment.cookieDomain);
  }
}
