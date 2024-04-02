import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'


export interface APIModel {
  _key?: number
  creation_date: number
  name: string
  dni: string
  birth_date: number
  photo_url: string
}

@Injectable({
  providedIn: 'root',
})
export default class APIService {

  async sendData(data: APIModel): Promise<unknown> {
    const endpoint = new URL('/api/send-data/', environment.apiURL)

    const formData = new FormData()

    //@ts-ignore
    if (data.birth_date === '') {
      throw new Error(`"birth_date" field is required.`)
    }

    data.creation_date = new Date(data.creation_date).getTime()
    data.birth_date = new Date(data.birth_date).getTime()

    for (const key in data) {
      //@ts-ignore
      formData.set(key, data[key])
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (response.status !== 200) {
      throw new Error(`Request rejected with status code ${response.status}.`)
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
      throw new Error(`Request rejected with status code ${response.status}.`)
    }

    const items = await response.json() as APIModel[]

    return items
  }

  async editData(data: APIModel) {
    const key = data._key as number
    const endpoint = new URL(`/api/edit-data/${key}`, environment.apiURL)

    const formData = new FormData()

    data.birth_date = new Date(data.birth_date).getTime()

    for (const key in data) {
      //@ts-ignore
      formData.set(key, data[key])
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (response.status !== 200) {
      throw new Error(`Request rejected with status code ${response.status}`)
    }
  }

  async loadCSVFile(file: File) {
    const endpoint = new URL(`/api/send-data-csv/`, environment.apiURL)

    const formData = new FormData()
    formData.append('csv_file', file)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (response.status !== 200) {
      throw new Error(`Request rejected with status code ${response.status}.`)
    }
  }

}
