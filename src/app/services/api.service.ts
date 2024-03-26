import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'


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

  async sendData(data: APIModel): Promise<unknown> {
    const endpoint = new URL('/api/send-data/', environment.apiURL)

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
    const url = new URL(`/api/get-all-data/`, environment.apiURL)
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
