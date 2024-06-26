import { Component, OnInit, inject } from '@angular/core';
import APIService, { APIModel } from '../../services/api.service.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'
import { TableComponent } from '../../components/table/table.component.js'
import { FormsModule } from '@angular/forms'
import ModalService from '../../services/modal.service.js'
import { EditDataComponent } from '../../components/edit-data/edit-data.component.js'
import { formatDateNumberAsYearMonthDay } from '../../../utils/date-utils.js'
import { createFileList } from '../../../utils/input-utils.js'

@Component({
  selector: 'app-data-list[data-page-component]',
  standalone: true,
  imports: [SpinnerComponent, LabelInputComponent, TableComponent, FormsModule],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.css',
})
export class DataListComponent implements OnInit {

  private _apiService = inject(APIService)

  private _modalService = inject(ModalService)

  listData: APIModel[] | Error | null = null

  filterValue = ''

  private _fetchDelay = 500

  private _fetchTimeout: number = -1

  isLoading = false

  onFilterValueChange() {
    window.clearTimeout(this._fetchTimeout)

    this._fetchTimeout = window.setTimeout(async () => {
      await this.fetchData()
    }, this._fetchDelay)
  }

  async loadCSVFile(event: Event) {
    const target = event.target

    if (!(target instanceof HTMLInputElement)) {
      return
    }

    const [file] = target.files as unknown as File[]

    if (!file) {
      return
    }

    if (file.size === 0) {
      alert('Cannot upload empty file. Try with another file.')

      target.files = createFileList()
      return
    }

    this.isLoading = true

    await this._apiService.loadCSVFile(file)
    .then(() => {
      alert('CSV uploaded successfuly.')
      this.fetchData()
    })
    .catch(reason => {
      if (reason.cause) {
        const {code, message} = reason.cause

        console.warn('Cause', reason.cause)
        console.warn(reason)

        alert(message)

        return
      }

      alert(`An error happend during the upload of the CSV file.\nMake sure that file format is valid.\nThe file must contain the following columns "name,dni,birth_date" and optionally "photo_url".\nSeparator character of the CSV must be a comma.`)
    })
    .finally(() => {
      this.isLoading = false

      // Reset input
      target.files = createFileList()
    })
  }

  async ngOnInit() {
    await this.fetchData()
  }

  async editData(item: APIModel) {
    const component = this._modalService.open(EditDataComponent)

    component.prefillData = item

    try {
      await component.waitForResult()
    } catch {
      return
    }

    this._modalService.close()

    this.fetchData()
  }

  async deleteData(item: APIModel) {
    const answer = confirm(`Do you really want to delete this item?`)

    if (!answer) {
      return
    }

    await this._apiService.deleteData(item)
    .then(() => {
      // alert(`Item deleted successfuly.`)
      this.fetchData()
    })
    .catch(reason => {
      alert(`An error happened trying to delete the item.\n${reason.message}`)
    })
  }

  async fetchData() {
    this.listData = null

    try {
      this.listData = await this._apiService.getAllData(this.filterValue)
    } catch (reason) {
      this.listData = reason as Error
    }

    console.log({fetchedData: this.listData})
  }

  isError(error: unknown): error is Error {
    if (error == null) {
      return false
    }

    return error instanceof Error
  }

  formatDate(dateNumber: number) {
    return formatDateNumberAsYearMonthDay(dateNumber)
  }

}
