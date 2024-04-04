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

  private validateData(data: APIModel) {
    if (data.name === '') {
      throw new Error(`"Name" field is required.`)
    }

    if (data.name.length > 30) {
      throw new Error(`"Name" field cannot be longer than 30 characters.`)
    }

    if (data.dni === '') {
      throw new Error(`"DNI" field is required.`)
    }

    const dniRegExp = /^[1-9]{8,8}[A-Z]$/
    if (!dniRegExp.test(data.dni)) {
      throw new Error(`"DNI" field must follow this format "12345678A".`)
    }

    if (Number.isNaN(data.birth_date)) {
      throw new Error(`"Birth Date" field is required.`)
    }
  }

  async sendData(data: APIModel): Promise<unknown> {
    const endpoint = new URL('/api/send-data/', environment.apiURL)

    this.validateData(data)

    const formData = new FormData()

    data.creation_date = Date.now()
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

    this.validateData(data)

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

  async deleteData(data: APIModel) {
    const key = data._key as number
    const endpoint = new URL(`/api/delete-data/${key}`, environment.apiURL)

    const response = await fetch(endpoint, {
      method: 'POST',
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
      let errorMessage: {code: string, message: string}

      try {
        errorMessage = await response.json()
      } catch (reason) {
        throw new Error(`An expected error.`)
      }

      throw new Error(`Request rejected with status code ${response.status}.`, {cause: errorMessage})
    }
  }

}
