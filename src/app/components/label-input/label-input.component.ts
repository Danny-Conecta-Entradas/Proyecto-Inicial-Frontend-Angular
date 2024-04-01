import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms'
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
  // @ViewChild('input', {read: NgModel})
  inputElement!: ElementRef<HTMLInputElement>

  @Input()
  label: string = 'Unnamed Label'

  @Input()
  type: HTMLInputElement['type'] = 'text'

  @Input()
  name: string = ''

  @Input()
  accept: string = ''

  inputValue: null | string = ''

  @Input()
  get value(): string | null {
    return this.inputValue
  }

  set value(val: null | number | string | File | File[]) {
    if (val == null) {
      return
    }

    if (val instanceof File) {
      this.inputElement.nativeElement.files = createFileList([val])
      return
    }

    if (Array.isArray(val)) {
      this.inputElement.nativeElement.files = createFileList(val)
      return
    }

    if (this.inputElement?.nativeElement.type === 'date') {
      if (typeof val === 'string') {
        this.inputValue = val
      }
      else
      if (typeof val === 'number') {
        this.inputValue = formatDateNumberAsYearMonthDay(val)
      }
    }

    this.inputValue = String(val)

    this.valueChange.emit(this.inputValue)
  }

  @Output()
  valueChange = new EventEmitter<null | string>()

  @Input()
  placeholder: string = ''

}
