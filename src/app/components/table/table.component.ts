import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  selector: 'table[table-component]',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnChanges {

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

  ngOnChanges(changes: SimpleChanges) {
    if (this.displayedColumns.length === 0) {
      this.displayedColumns = this.getDefaultColumns()
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

}
