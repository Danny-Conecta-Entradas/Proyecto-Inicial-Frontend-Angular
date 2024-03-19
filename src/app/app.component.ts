import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Proyecto-Inicial-Frontend-Angular';
}


const API_ORIGIN = 'https://proyecto-inicial-backend-agk6kyxhfa-uc.a.run.app/'

interface FormData {
  qr_string: string
  timestamp: number
}

async function sendData(data: FormData) {
  const endpoint = new URL('/api/send-data/', API_ORIGIN)

  const stringifiedData = JSON.stringify(data)

  const response = await fetch(endpoint, {
    method: 'POST',
    body: stringifiedData,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}


const form = document.querySelector('form')

form?.addEventListener('submit', event => {
  event.preventDefault()

  const formData = Object.fromEntries(new FormData(form)) as {qr_string: string}

  const resultData: FormData = {...formData, timestamp: Date.now()}

  console.log(resultData)

  sendData(resultData)
  .then(value => alert('Data uploaded successfuly.'))
  .catch(reason => {
    console.error(reason)
    alert('An error occurred after submiting the form.')
  })
})
