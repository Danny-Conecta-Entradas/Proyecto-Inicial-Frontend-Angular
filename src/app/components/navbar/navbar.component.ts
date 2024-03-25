import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import AuthService from '../../services/auth.service.js'

@Component({
  selector: 'nav[navbar-component]',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  private _authService = inject(AuthService)

  private _router = inject(Router)

  async ngOnInit() {
    const userData = await this._authService.getLoggedUserData()

    this.email = userData?.email
  }

  async logOut() {
    await this._authService.logOut()

    this._router.navigateByUrl('/')
  }

  email: string | null | undefined = ''

}
