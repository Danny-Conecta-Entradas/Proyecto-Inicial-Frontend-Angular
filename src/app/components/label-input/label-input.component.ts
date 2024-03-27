import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'label-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './label-input.component.html',
  styleUrl: './label-input.component.css',
})
export class LabelInputComponent {

  @Input()
  label: string = 'Unnamed Label'

  @Input()
  type: HTMLInputElement['type'] = 'text'

  @Input()
  name: string = ''

  @Input()
  accept: string = ''

  inputValue = ''

  @Input()
  get value() {
    return this.inputValue
  }

  set value(val) {
    this.inputValue = val
    this.valueChange.emit(this.inputValue)
  }

  @Output()
  valueChange = new EventEmitter<string>()

  @Input()
  placeholder: string = ''

}
