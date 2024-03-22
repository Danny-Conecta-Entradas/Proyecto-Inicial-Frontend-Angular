import { Injectable } from '@angular/core'


export interface APIModel {
  creation_date: string
  name: string
  dni: string
  birth_date: string
}

@Injectable({
  providedIn: 'root',
})
export default class APIService {

  readonly API_ORIGIN_DEV = 'http://127.0.0.1:8080/'

  readonly API_ORIGIN = 'https://proyecto-inicial-backend-agk6kyxhfa-uc.a.run.app/'

  async sendData(data: APIModel): Promise<unknown> {
    const endpoint = new URL('/api/send-data/', this.API_ORIGIN)

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

  async getAllData() {
    const endpoint = new URL('/api/get-all-data/', this.API_ORIGIN)

    const response = await fetch(endpoint)

    const items = await response.json() as APIModel[]

    return items
  }

}
