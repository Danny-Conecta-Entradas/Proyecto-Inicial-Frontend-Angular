import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms'

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

  set value(val: null | string | File | File[]) {
    if (val instanceof File) {
      this.inputElement.nativeElement.files = createFileList([val])
      return
    }

    if (Array.isArray(val)) {
      this.inputElement.nativeElement.files = createFileList(val)
      return
    }

    this.inputValue = val

    this.valueChange.emit(this.inputValue)
  }

  @Output()
  valueChange = new EventEmitter<null | string>()

  @Input()
  placeholder: string = ''

}

function createFileList(files: File[]) {
  const dataTransfer = new DataTransfer()

  for (const file of files) {
    dataTransfer.items.add(file)
  }

  return dataTransfer.files
}
