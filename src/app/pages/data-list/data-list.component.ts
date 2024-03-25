import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router'
import APIService, { APIModel } from '../../services/api.service.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import { InputComponent } from '../../components/input/input.component.js'
import { TableComponent } from '../../components/table/table.component.js'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-data-list[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent, InputComponent, TableComponent, FormsModule],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.css',
})
export class DataListComponent implements OnInit {

  private _apiService = inject(APIService)

  fetchedListData: APIModel[] | Error | null = null

  get listData() {
    if (this.fetchedListData == null || this.fetchedListData instanceof Error) {
      return this.fetchedListData
    }

    if (this.filterValue === '') {
      return this.fetchedListData
    }

    const filteredList = this.fetchedListData.filter(item => {
      const values: unknown[] = Object.values(item)

      return values.some(value => {
        const stringValue = String(value).toLowerCase()

        return stringValue.includes(this.filterValue.toLowerCase())
      })
    })

    return filteredList
  }

  filterValue = ''

  async ngOnInit() {
    try {
      this.fetchedListData = await this._apiService.getAllData()
    } catch (reason) {
      this.fetchedListData = reason as Error
    }
  }

  isError(error: unknown): error is Error {
    if (error == null) {
      return false
    }

    return error instanceof Error
  }

}
