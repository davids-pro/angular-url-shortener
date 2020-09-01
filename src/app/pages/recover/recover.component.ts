import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { fadeInTranslateYTop } from '../../animations/animations';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: [ './recover.component.scss' ],
  animations: [ fadeInTranslateYTop ]
})
export class RecoverComponent implements OnInit {
  recoverForm: FormGroup;
  codeSent = false;

  constructor(private fb: FormBuilder, private userService: UserService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    // génération du formulaire de modification du mot de passe
    this.recoverForm = this.fb.group({
      username: [ '', Validators.required ],
      code: [
        { value: '', disabled: true },
        Validators.compose([ Validators.required, Validators.minLength(6), Validators.maxLength(6) ])
      ],
      newPassword: [ { value: '', disabled: true }, Validators.required ],
      confirmPassword: [ { value: '', disabled: true }, Validators.compose([ Validators.required, this.passwordMatcher() ]) ]
    });
  }

  // vérification existance utilisateur en bdd et envoi du mail avec code de récupération
  verifyUser() {
    this.userService
      .verifyIfUsernameIsAvailable(this.recoverForm.value.username)
      .then((unknownUser) => {
        if (unknownUser) {
          this.snackBar.open(`Nom d'utilisateur inconnu`, '', {
            duration: 2000,
            horizontalPosition: 'start'
          });
        } else {
          this.snackBar.open(`Un email vient de vous être envoyé`, '', {
            duration: 2000,
            horizontalPosition: 'start'
          });
          this.userService
            .sendResetCode(this.recoverForm.value.username)
            .then(() => {
              this.codeSent = true;
              this.recoverForm.get('code').enable();
              this.recoverForm.get('newPassword').enable();
              this.recoverForm.get('confirmPassword').enable();
              this.recoverForm.get('code').reset();
              this.recoverForm.get('newPassword').reset();
              this.recoverForm.get('confirmPassword').reset();
            })
            .catch(() => {
              this.snackBar.open(`Erreur de traitement, veuillez réessayer`, '', { duration: 2000, horizontalPosition: 'start' });
            });
        }
      })
      .catch(() => {
        this.snackBar.open(`Erreur de traitement, veuillez réessayer`, '', {
          duration: 2000,
          horizontalPosition: 'start'
        });
      });
  }

  // vérification de la concordance des mots de passe
  passwordMatcher(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        return control.value !== control.root.get('newPassword').value ? { unmatch: true } : null;
      }
      return null;
    };
  }

  // mise à jour de l'utilisateur et redirection vers la page de login
  updateUser() {
    this.userService
      .updatePassword(this.recoverForm.value.username, this.recoverForm.value.newPassword, this.recoverForm.value.code)
      .then(() => {
        this.snackBar.open(`Mot de passe modifié avec succès`, '', {
          duration: 2000,
          horizontalPosition: 'start'
        });
        this.router.navigate([ 'login' ], { skipLocationChange: true });
      })
      .catch(() => {
        this.snackBar.open(`Code de sécurité incorrect`, '', {
          duration: 2000,
          horizontalPosition: 'start'
        });
      });
  }
}
