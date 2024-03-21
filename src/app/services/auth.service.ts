import { Injectable, inject } from '@angular/core'
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth'
import firebase from '@firebase/app-compat'
import { firstValueFrom } from 'rxjs'


@Injectable({
  providedIn: 'root',
})
export default class AuthService {

  private _auth = inject(Auth)

  readonly authState = authState(this._auth)

  async logIn(email: string, password: string) {
    const userCredentialsOrError = await signInWithEmailAndPassword(this._auth, email, password)
                                   .catch((reason: any) => new Error(reason))

    if (userCredentialsOrError instanceof Error) {
      console.error(userCredentialsOrError)
      alert(`No se ha podido iniciar sesión. Error: ${userCredentialsOrError.message}`)
      return null
    }

    return userCredentialsOrError
  }

  async logOut() {
    await this._auth.signOut()
  }

  async signUp(email: string, password: string) {
    const userCredentialsOrError = await createUserWithEmailAndPassword(this._auth, email, password)
                                         .catch((reason: any) => new Error(reason))

    if (userCredentialsOrError instanceof Error) {
      console.error(userCredentialsOrError)
      alert(`No se ha podido registrar la cuenta. Error: ${userCredentialsOrError.message}`)
      return null
    }

    return userCredentialsOrError
  }

  async getLoggedUserData() {
    // https://rxjs.dev/deprecations/to-promise
    const userData = await firstValueFrom(this.authState)

    return userData
  }

  async isUserLogged() {
    const userData = await this.getLoggedUserData()

    return Boolean(userData)
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
