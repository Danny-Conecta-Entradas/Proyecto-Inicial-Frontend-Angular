import { Component, OnInit, inject } from '@angular/core';
import APIService, { APIModel } from '../../services/api.service.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'
import { LabelInputComponent } from '../../components/label-input/label-input.component.js'
import { TableComponent } from '../../components/table/table.component.js'
import { FormsModule } from '@angular/forms'
import ModalService from '../../services/modal.service.js'
import { EditDataComponent } from '../../components/edit-data/edit-data.component.js'
import { formatDateNumberAsYearMonthDay } from '../../../utils/date-utils.js'

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

  onFilterValueChange() {
    window.clearTimeout(this._fetchTimeout)

    this._fetchTimeout = window.setTimeout(async () => {
      await this.fetchData()
    }, this._fetchDelay)
  }

  async ngOnInit() {
    await this.fetchData()
  }

  async editData(item: APIModel) {
    const component = this._modalService.open(EditDataComponent)

    component.prefillData = item

    await component.waitForResult()

    this._modalService.close()

    this.fetchData()
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
