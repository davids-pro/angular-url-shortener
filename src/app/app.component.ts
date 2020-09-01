import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CookiesService } from './services/cookies.service';
import { DataService } from './services/data.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  loaded = false;

  constructor(
    private bottomSheet: MatBottomSheet,
    private cookiesService: CookiesService,
    private dataService: DataService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // vérification présence du cookie de login
    if (this.cookiesService.checkCookie('login')) {
      const token = this.cookiesService.getCookie('login');
      this.userService
        .getUserbyToken(token)
        .then((response: any) => {
          // connexion utilisateur grâce au token JWT
          this.dataService.user._id = response.mongoUser._id;
          this.dataService.user.username = response.mongoUser.username;
        })
        .catch(() => {
          // si erreur suppression du cookie et redirection vers la page de login
          this.cookiesService.deleteCookie('login');
          this.router.navigate([ 'login' ], { skipLocationChange: true });
        })
        .finally(() => {
          this.loaded = true;
        });
    } else {
      this.loaded = true;
    }
    // lancement bottomSheet RGPD si absence du cookie de validation
    if (!this.cookiesService.checkCookie('rgpd')) {
      this.bottomSheet.open(RgpdComponent, {
        panelClass: 'bottom-sheet-container',
        hasBackdrop: false,
        disableClose: true
      });
    }
  }
}

@Component({
  selector: 'app-rgpd',
  templateUrl: 'rgpd.component.html'
})
export class RgpdComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<RgpdComponent>, private cookiesService: CookiesService) {}

  accept() {
    this.cookiesService.setCookie('rgpd', '', 365);
    this.bottomSheetRef.dismiss();
  }

  dismiss() {
    this.cookiesService.deleteAllCookies();
    this.bottomSheetRef.dismiss();
  }
}
