import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import firebase from '@firebase/app-compat'


export default class AuthService {

  constructor(private _auth: AngularFireAuth) {}

  async logIn(email: string, password: string) {
    const userCredentialsOrError = await this._auth.signInWithEmailAndPassword(email, password)
                              .catch(reason => new Error(reason))

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
    const userCredentialsOrError = await this._auth.createUserWithEmailAndPassword(email, password)
                              .catch(reason => new Error(reason))

    if (userCredentialsOrError instanceof Error) {
      console.error(userCredentialsOrError)
      alert(`No se ha podido registrar la cuenta. Error: ${userCredentialsOrError.message}`)
      return null
    }

    return userCredentialsOrError
  }

  getLoggedUserData() {
    return this._auth.authState
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
