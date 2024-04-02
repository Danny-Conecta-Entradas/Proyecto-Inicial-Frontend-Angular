import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { formatDateNumberAsYearMonthDay } from '../../../utils/date-utils.js'
import { createFileList } from '../../../utils/input-utils.js'

@Component({
  selector: 'label-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './label-input.component.html',
  styleUrl: './label-input.component.css',
})
export class LabelInputComponent {

  @ViewChild('input')
  inputElement!: ElementRef<HTMLInputElement>

  @Input()
  label: string = 'Unnamed Label'

  @Input()
  type: HTMLInputElement['type'] = 'text'

  @Input()
  name: string = ''

  @Input()
  accept: string = ''

  inputValue: string = ''

  realInputValue: null | boolean | number | string | File | File[] | Date = null

  files: FileList | null = null

  @Input()
  get value(): string {
    return this.inputValue
  }

  set value(val: LabelInputComponent['realInputValue']) {
    this.realInputValue = val

    switch (this.type) {

      case 'email':
      case 'password':
      case 'text': {
        if (this.realInputValue == null) {
          this.inputValue = ''
        }
        else
        if (typeof this.realInputValue === 'string') {
          this.inputValue = this.realInputValue
        }
      }
      break

      case 'number': {
        if (this.realInputValue == null) {
          this.inputValue = ''
        }
        else
        if (typeof this.realInputValue === 'string') {
          this.inputValue = this.realInputValue
        }
        else
        if (typeof this.realInputValue === 'number') {
          this.inputValue = String(this.realInputValue)
        }
      }
      break

      case 'file': {
        if (this.realInputValue == null) {
          this.files = null
        }
        else
        if (this.realInputValue instanceof File) {
          this.files = createFileList([this.realInputValue])
        }
        else
        if (Array.isArray(this.realInputValue) && this.realInputValue[0] instanceof File) {
          this.files = createFileList(this.realInputValue)
        }
      }
      break

      case 'date': {
        if (this.realInputValue == null) {
          this.inputValue = ''
        }
        else
        if (typeof this.realInputValue === 'string') {
          this.inputValue = this.realInputValue
        }
        else
        if (typeof this.realInputValue === 'number') {
          this.inputValue = formatDateNumberAsYearMonthDay(this.realInputValue)
        }
        else
        if (this.realInputValue instanceof Date) {
          this.inputValue = formatDateNumberAsYearMonthDay(this.realInputValue.getTime())
        }
      }
      break

    }

    this.valueChange.emit(this.inputValue)
  }

  @Output()
  valueChange = new EventEmitter<null | string>()

  @Input()
  placeholder: string = ''

}
