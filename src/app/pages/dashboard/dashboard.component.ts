import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, timer } from 'rxjs';
import { Document } from 'src/app/models/document.model';
import { DataService } from 'src/app/services/data.service';
import { DocumentService } from 'src/app/services/document.service';
import {
  fadeInTranslateXLeft,
  fadeInTranslateXRight,
  fadeInTranslateYBottom,
  fadeInTranslateYTop
} from '../../animations/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  animations: [
    fadeInTranslateXLeft,
    fadeInTranslateXRight,
    fadeInTranslateYBottom,
    fadeInTranslateYTop
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  documents: Array<Document> = [];
  loaded = false;
  subscription: Subscription;
  timer: Observable<number> = timer(0, 3000);

  constructor(
    private clipboard: Clipboard,
    private dataService: DataService,
    public dialog: MatDialog,
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // souscription à la liste des documents par id mongoDB utilisateur
    this.subscription = this.timer.subscribe(
      () => {
        this.documentService
          .getDocumentsByUserId(this.dataService.user._id)
          .subscribe(
            (response: any) => {
              this.documents = response;
              this.loaded = true;
            },
            (err) => {
              console.log(err);
            }
          );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // copie du lien en mémoire
  copyLink(document: Document) {
    this.snackBar.open('Lien copié', '', {
      duration: 2000,
      horizontalPosition: 'start'
    });
    this.clipboard.copy(`https://shortened.daedal.pro/${document.shortId}`);
  }

  // affichage du QR Code
  showQrCode(document: Document) {
    this.dialog.open(QrCodeComponent, {
      data: {
        qrCode: document.qrCode
      }
    });
  }

  // suppression du document par id mongoDB
  deleteDocument(document: Document) {
    this.documentService
      .deleteDocumentById(document._id)
      .then(() => {
        this.snackBar.open('Document effacé', '', {
          duration: 2000,
          horizontalPosition: 'start'
        });
        this.documentService
          .getDocumentsByUserId(this.dataService.user._id)
          .subscribe(
            (response: any) => {
              this.documents = response;
              this.loaded = true;
            },
            (err) => {
              console.log(err);
            }
          );
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

@Component({
  selector: 'app-qrcode',
  templateUrl: 'qrcode.component.html'
})
export class QrCodeComponent {
  qrCode: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.qrCode = data.qrCode;
  }
}
