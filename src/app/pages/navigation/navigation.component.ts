import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CookiesService } from 'src/app/services/cookies.service';
import { DataService } from 'src/app/services/data.service';
import { faFacebook, faDiscord, faTwitter, faLinkedin, faYoutube, faTwitch } from '@fortawesome/free-brands-svg-icons';
import { fadeIn } from '../../animations/animations';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.scss' ],
  animations: [ fadeIn ]
})
export class NavigationComponent {
  data = this.dataService;
  faFacebook = faFacebook;
  faDiscord = faDiscord;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faYoutube = faYoutube;
  faTwitch = faTwitch;

  constructor(private cookiesService: CookiesService, private dataService: DataService, private router: Router) {}

  // méthode de redirection vers le composant souhaité
  goTo(component: string) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([ component ], { skipLocationChange: true });
    });
  }

  // déconnexion de l'utilisateur, suppression de son token JWT et de la validation rgpd en cookie
  disconnect() {
    this.cookiesService.deleteCookie('login');
    this.cookiesService.deleteCookie('rgpd');
    this.dataService.user = new User();
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([ 'home' ], { skipLocationChange: true });
    });
  }
}
