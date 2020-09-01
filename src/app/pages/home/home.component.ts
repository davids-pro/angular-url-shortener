import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { fadeInTranslateXLeft } from '../../animations/animations';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ],
  animations: [ fadeInTranslateXLeft ]
})
export class HomeComponent implements OnInit {
  data = this.dataService.user;
  document = new Document();
  loading = false;
  urlForm: FormGroup;

  constructor(
    private clipboard: Clipboard,
    private dataService: DataService,
    public dialog: MatDialog,
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // génération du formulaire de raccourcissement d'url
    this.urlForm = this.formBuilder.group({
      url: [ '' ],
      slug: [ { value: '', disabled: true }, Validators.pattern, this.slugVerificator() ]
    });
    if (this.dataService.user._id !== undefined) {
      this.urlForm.get('slug').enable();
    }
  }

  // vérification disponibilité id personnalisé
  slugVerificator(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      if (control.value !== undefined && control.value !== '') {
        const response = await this.documentService.verifyIfshortIdIsAvailable(control.value);
        return !response ? { unavailable: true } : null;
      }
      return null;
    };
  }

  keyboardSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.createDocument();
    }
  }

  // tri pour crétaion document générique ou personnalisé
  createDocument() {
    if (this.urlForm.valid && this.urlForm.value.url !== '') {
      this.urlForm.value.slug === '' || this.urlForm.value.slug === undefined ? this.createGenericDocument() : this.createCustomDocument();
    } else {
      this.snackBar.open('Oops il manque le lien :D', '', {
        duration: 2000,
        horizontalPosition: 'start'
      });
    }
  }

  // création d'un document générique
  createGenericDocument() {
    this.loading = true;
    this.documentService
      .createGenericDocument(this.urlForm.value.url, this.dataService.user._id !== undefined ? this.dataService.user._id : '')
      .then((response: any) => {
        this.loading = false;
        this.document = response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // création d'un document personnalisé
  createCustomDocument() {
    this.loading = true;
    this.documentService
      .createCustomDocument(this.urlForm.value.url, this.urlForm.value.slug, this.dataService.user._id)
      .then((response: any) => {
        this.loading = false;
        this.document = response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // mise en mémoire du lien pour partage
  copyLink() {
    this.snackBar.open('Lien copié', '', {
      duration: 2000,
      horizontalPosition: 'start'
    });
    this.clipboard.copy(`https://shortened.daedal.pro/${this.document.shortId}`);
  }

  // réinitialisation de la page
  reset() {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([ 'home' ], { skipLocationChange: true });
    });
  }

  // affichage du QR Code
  showQrCode() {
    this.dialog.open(QrCodeComponent, {
      data: {
        qrCode: this.document.qrCode
      }
    });
  }
}

@Component({
  selector: 'app-qrcode',
  templateUrl: 'qrcode.component.html'
})
export class QrCodeComponent {
  qrCode: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar) {
    this.qrCode = data.qrCode;
  }
}
