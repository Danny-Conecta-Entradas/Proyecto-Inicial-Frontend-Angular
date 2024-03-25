import { Injectable, inject } from '@angular/core'
import { Auth, GoogleAuthProvider, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth'
import firebase from '@firebase/app-compat'
import { firstValueFrom, map } from 'rxjs'


@Injectable({
  providedIn: 'root',
})
export default class AuthService {

  private _auth = inject(Auth)

  readonly authState = authState(this._auth)

  async logIn(email: string, password: string) {
    const userCredentialsOrError = await signInWithEmailAndPassword(this._auth, email, password)

    return userCredentialsOrError
  }

  async logOut() {
    await this._auth.signOut()
  }

  async signUp(email: string, password: string) {
    const userCredentialsOrError = await createUserWithEmailAndPassword(this._auth, email, password)

    return userCredentialsOrError
  }

  async signInWithGoogle() {
    // https://firebase.google.com/docs/auth/web/google-signin
    const provider = new GoogleAuthProvider()

    const credentials = await signInWithPopup(this._auth, provider)

    return credentials
  }

  async getLoggedUserData() {
    // https://rxjs.dev/deprecations/to-promise
    const userData = await firstValueFrom(this.authState)

    return userData
  }

  // async isUserLogged() {
  //   const userData = await this.getLoggedUserData()

  //   return Boolean(userData)
  // }

  isUserLogged() {
    return this.authState.pipe(
      map(user => Boolean(user))
    )
  }

  async updateUserProfile(name: string, photo: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
        unsubscribe()

        if (!user) {
          console.warn('No logged user found.')
          resolve(false)
          return
        }

        await user.updateProfile({
          displayName: name,
          photoURL: photo,
        })

        resolve(true)
      })
    })
  }

}
