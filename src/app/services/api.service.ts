import { Injectable } from '@angular/core'


export interface APIModel {
  _key?: number
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

    if (response.status !== 200) {
      throw new Error(`Request rejected with status code ${response.status}`)
    }

    return await response.json()
  }

  async getAllData(filter?: string) {
    const url = new URL(`/api/get-all-data/`, this.API_ORIGIN)
    if (filter) {
      url.searchParams.set('filter', filter)
    }

    const endpoint = url

    const response = await fetch(endpoint)

    if (response.status !== 200) {
      throw new Error(`Request rejected with status code ${response.status}`)
    }

    const items = await response.json() as APIModel[]

    return items
  }

}
