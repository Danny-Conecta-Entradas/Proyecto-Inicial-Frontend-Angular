import { Component, Input } from '@angular/core';

@Component({
  selector: 'label-input',
  standalone: true,
  imports: [],
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

  @Input()
  placeholder: string = ''

}
