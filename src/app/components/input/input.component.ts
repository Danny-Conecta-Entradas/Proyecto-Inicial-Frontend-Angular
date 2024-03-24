import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'label-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {

  @Input()
  label: string = 'Unnamed Label'

  @Input()
  type: HTMLInputElement['type'] = 'text'

  @Input()
  name: string = ''

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
