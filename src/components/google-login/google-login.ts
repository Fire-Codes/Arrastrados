import {GooglePlus} from '@ionic-native/google-plus';
import { Component } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from "rxjs/Observable";


import { Platform } from "ionic-angular";

/**
 * Generated class for the GoogleLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {

  user: Observable<firebase.User>;

  text: string;

  constructor(
    private gplus: GooglePlus,
    private afauth: AngularFireAuth,
    private platform: Platform
  ) {
    this.user = this.afauth.authState;
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleSignin();
    } else {
      this.webGoogleSignin();
    }
  }

  async nativeGoogleSignin(): Promise<any> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '561640733546-gu66lvu52mcac2jiq80qvq0go530a3f1.apps.googleusercontent.com',
        'secret' : 'Usxv6j_rI7sq0ngj9x-NdnbS',
        'offline': true,
        'scopes': ["https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.google.com/m8/feeds",
          "https://www.google.com/calendar/feeds",
          "https://www.googleapis.com/auth/gmail.readonly"]
      });

      return await this.afauth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  async webGoogleSignin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afauth.auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  signOut() {
    this.afauth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
  }

}
