import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { NavbarComponent } from './components/navbar/navbar.component.js'
import AuthService from './services/auth.service.js'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFireAuthModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  readonly title = 'Proyecto-Inicial-Frontend-Angular'

  private _authService = inject(AuthService)

  isUserLogged = false

  ngOnInit() {
    this._authService.isUserLogged().subscribe(isLogged => this.isUserLogged = isLogged)
  }

}
