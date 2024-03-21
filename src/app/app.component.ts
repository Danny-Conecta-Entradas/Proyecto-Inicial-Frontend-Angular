import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AngularFireAuthModule } from '@angular/fire/compat/auth'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFireAuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  readonly title = 'Proyecto-Inicial-Frontend-Angular';

}
