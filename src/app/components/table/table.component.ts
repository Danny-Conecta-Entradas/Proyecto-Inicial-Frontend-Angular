import { Component, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component.js'

type TableItem = {
  [key: string]: any
}

interface TableColumn {
  name: string
  keyName: string
  width?: string
  transformValue?: (item: any) => unknown
  type?: 'image'
  imageOptions?: {width: number, height: number, placeholder?: string, style?: {[key: string]: string}}
}

type Action = {
  name: string
  callback: (item: any) => void
}

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnChanges {

  private _host: ElementRef<HTMLTableElement> = inject(ElementRef<HTMLTableElement>)

  @Input()
  items: TableItem[] | Error | null = null

  @Input()
  displayedColumns: TableColumn[] = []

  @Input()
  track?: string

  @Input()
  actionsColumn?: {name: string, width?: string} = {name: 'Actions'}

  @Input()
  actions?: Action[]

  @Input()
  scrollable = false

  @Input()
  pagination = false

  @Input()
  pageRows: number = 10

  /**
   * Pages first index is 0 like Arrays
   */
  currentPage = 0

  get pagesLength() {
    if (!this.hasPagination()) {
      return 0
    }

    if (Array.isArray(this.items)) {
      return Math.ceil(this.items.length / this.pageRows)
    }

    return 0
  }

  hasPagination() {
    return this.pagination && this.pageRows > 0
  }

  get displayedItems() {
    if (!this.hasPagination()) {
      return this.items
    }

    if (!Array.isArray(this.items)) {
      return this.items
    }

    const start = this.currentPage * this.pageRows
    const end = start + this.pageRows

    const pageItems = this.items.slice(start, end)

    return pageItems
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.displayedColumns && this.displayedColumns.length === 0) {
      this.displayedColumns = this.getDefaultColumns()
    }

    // Handle sizing of the table depending if it is scrollable and have items
    if (changes.items) {
      if (this.hasPagination()) {
        this.currentPage = 0
      }

      if (!Array.isArray(this.items)) {
        Object.assign(this._host.nativeElement.style, {
          height: '',
        })
      }
      else
      if (!this.scrollable) {
        Object.assign(this._host.nativeElement.style, {
          height: 'auto',
        })
      }
    }
  }

  getDefaultColumns() {
    if (!Array.isArray(this.items)) {
      return []
    }

    const firstItem = this.items[0]

    if (!firstItem) {
      return []
    }

    return Object.keys(firstItem).map(keyName => ({name: keyName, keyName: keyName}))
  }

  getItemValues(item: TableItem) {
    const values: unknown[] = []

    for (const {keyName} of this.displayedColumns) {
      values.push(item[keyName])
    }

    return values
  }

  isError(error: unknown): error is Error {
    if (error == null) {
      return false
    }

    return error instanceof Error
  }

  setPage(pageIndex: number) {
    if (!this.hasPagination() || this.pagesLength === 0) {
      return
    }

    this.currentPage = Math.max(0, Math.min(pageIndex, this.pagesLength - 1))
  }

  nextPage() {
    this.setPage(this.currentPage + 1)
  }

  previousPage() {
    this.setPage(this.currentPage - 1)
  }

  firstPage() {
    this.setPage(0)
  }

  lastPage() {
    this.setPage(this.pagesLength - 1)
  }

}
