import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import AuthService from '../../services/auth.service.js'
import { FirebaseError } from 'firebase/app'
import { UserCredential } from '@firebase/auth'

@Component({
  selector: `google-log-in`,
  standalone: true,
  imports: [],
  templateUrl: './google-log-in.component.html',
  styleUrl: './google-log-in.component.css'
})
export class GoogleLogInComponent {

  private _auth = inject(AuthService)

  @Output()
  success: EventEmitter<UserCredential> = new EventEmitter()

  @Output()
  error: EventEmitter<FirebaseError> = new EventEmitter()

  @HostListener('click', ['$event'])
  async onClick(event: PointerEvent) {
    const crendentials = await this._auth.signInWithGoogle().catch((reason: FirebaseError) => reason)

    if (crendentials instanceof FirebaseError) {
      this.error.emit(crendentials)
      return
    }

    this.success.emit(crendentials)
  }

}
