import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  rootUri = `${environment.apiEndPoint}/documents/`;

  constructor(private http: HttpClient) {}

  // création d'un document générique
  createGenericDocument(url: string, userId: string) {
    return this.http.post(this.rootUri, { url, userId }).toPromise();
  }

  // création d'un document personnalisé
  createCustomDocument(url: string, shortId: string, userId: string) {
    return this.http
      .post(this.rootUri + 'customId/' + shortId, {
        url,
        userId,
        customized: true
      })
      .toPromise();
  }

  // lecture d'un document par id shortener
  getDocumentByShortId(shortId: string) {
    return this.http.get(this.rootUri + shortId).toPromise();
  }

  // lecture d'un document par id mongoDB utilisateur
  getDocumentsByUserId(userId: string) {
    return this.http.get(this.rootUri + 'userId/' + userId);
  }

  // maj d'un document par id mongoDB
  updateDocumentById(document: Document, id: string) {
    return this.http.put(this.rootUri + id, document).toPromise();
  }

  // suppression d'un document par id mongoDB
  deleteDocumentById(id: string) {
    return this.http.delete(this.rootUri + id).toPromise();
  }

  // vérification disponibilité d'un id shortener
  verifyIfshortIdIsAvailable(shortId: string) {
    return this.http.get(this.rootUri + 'checkId/' + shortId).toPromise();
  }
}
