import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/services/cookies.service';
import { DataService } from 'src/app/services/data.service';
import { fadeInTranslateYTop } from '../../animations/animations';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  animations: [ fadeInTranslateYTop ]
})
export class LoginComponent implements OnInit {
  cookie = false;
  error = false;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookiesService: CookiesService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // génération du formulaire de connexion
    this.loginForm = this.formBuilder.group({
      username: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
  }

  // connexion utilisateur si pseudo et mot de passe OK, génération et enregistrement d'un token JWT, redirecton vers la home
  connectUser() {
    this.userService
      .getUserbyUsernameAndPassword(this.loginForm.value.username, this.loginForm.value.password)
      .then((response: any) => {
        console.log(response);
        this.dataService.user._id = response.mongoUser._id;
        this.dataService.user.username = response.mongoUser.username;
        if (this.cookie) {
          this.cookiesService.setCookie('login', response.token, 1);
        }
        this.router.navigate([ 'home' ], { skipLocationChange: true });
      })
      .catch(() => {
        this.error = true;
      });
  }

  //
  resetPasswordErrorMessage() {
    this.error = false;
  }

  // redirection vers la page de modification du mot de passe
  forgottenPassword() {
    this.router.navigate([ 'recover' ], { skipLocationChange: true });
  }
}
