import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/services/cookies.service';
import { DataService } from 'src/app/services/data.service';
import { fadeInTranslateYTop } from '../../animations/animations';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ './signup.component.scss' ],
  animations: [ fadeInTranslateYTop ]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  validation = false;

  constructor(
    private cookiesService: CookiesService,
    private dataService: DataService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // création du formulaire d'enregistrement
    this.signupForm = this.formBuilder.group({
      username: [ '', Validators.required, this.userVerificator() ],
      email: [ '', Validators.compose([ Validators.email, Validators.required ]) ],
      password: [ '', Validators.required ],
      confirmPassword: [ '', Validators.compose([ Validators.required, this.passwordMatcher() ]) ]
    });
  }

  // vérification de ma disponibilité du nom d'utilisateur, retourne un booléen en async
  userVerificator(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const response = await this.userService.verifyIfUsernameIsAvailable(control.value);
      return !response ? { unavailable: true } : null;
    };
  }

  // vérification de concordance des mots de passe
  passwordMatcher(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        return control.value !== control.root.get('password').value ? { unmatch: true } : null;
      }
      return null;
    };
  }

  // enregistrement de l'utilisateur en base de données
  submitUser() {
    this.userService
      .createUser({
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email
      })
      .then((response: any) => {
        console.log(response);
        this.dataService.user._id = response.mongoUser._id;
        this.dataService.user.username = response.mongoUser.username;
        // sauvagerde du token JWT de connexion dans les cookies et redirection vers la home
        this.cookiesService.setCookie('login', response.token, 1);
        this.router.navigate([ 'home' ], { skipLocationChange: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // modal des conditions d'utilisation du site
  policy() {
    this.dialog.open(PolicyComponent);
  }
}

@Component({
  selector: 'app-policy',
  templateUrl: 'policy.component.html'
})
export class PolicyComponent {}
