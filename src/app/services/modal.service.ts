import { ApplicationRef, Component, ComponentRef, ElementRef, EnvironmentInjector, HostListener, Injectable, Type, createComponent, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export default class ModalService {

  private _appRef = inject(ApplicationRef)

  private _envInjector = inject(EnvironmentInjector)

  private _modalComponentInstance: ComponentRef<ModalComponent> | null = null

  open<T>(ComponentClass: Type<T>) {
    return this.openWithComponent(ComponentClass)
  }

  async waitForClose() {
    await this._modalComponentInstance?.instance.waitForClose()
  }

  close() {
    this._modalComponentInstance?.instance.close()
  }

  openWithComponent<T>(ComponentClass: Type<T>) {
    const newComponent = createComponent(ComponentClass, {
      environmentInjector: this._envInjector,
    })

    this._modalComponentInstance = createComponent(ModalComponent, {
      environmentInjector: this._envInjector,
      projectableNodes: [[newComponent.location.nativeElement]],
    })

    document.body.append(this._modalComponentInstance.location.nativeElement)

    this._appRef.attachView(newComponent.hostView)
    this._appRef.attachView(this._modalComponentInstance.hostView)

    return newComponent
  }

}

@Component({
  selector: 'modal-component',
  standalone: true,
  imports: [],

  template: `
    <button class="close-button" (click)="close()">X</button>
    <ng-content></ng-content>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;

      display: grid;
      place-items: center;

      position: fixed;
      z-index: 9999;
      inset: 0;
      margin: auto;

      background-color: #0009;
    }

    .close-button {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99;
      margin: 1rem;

      transform: scaleY(0.875);

      padding: 0.5rem;

      background-color: #f00;
      border-radius: 0.4rem;

      font-family: monospace;
      font-size: 2rem;
      line-height: 0.7;

      @media (hover: hover) {
        &:hover {
          background-color: #e45858;
        }
      }

      &:focus-visible {
        background-color: #e45858;
      }

      &:active {
        background-color: #920000;
      }
    }
  `,
})
class ModalComponent {

  private _elementRef: ElementRef<HTMLElement> = inject(ElementRef)

  private _isClosed = false

  @HostListener('document:keyup.escape')
  onEscape() {
    this.close()
  }

  private _closeListeners = new Set<() => void>()

  onClose(listener: () => void) {
    this._closeListeners.add(listener)
  }

  close() {
    this._elementRef.nativeElement.remove()

    for (const closeListener of this._closeListeners) {
      try {
        closeListener()
      }
      catch (reason) {
        console.error(reason)
      }
    }

    this._closeListeners.clear()
  }

  waitForClose(): Promise<void> {
    return new Promise(resolve => {
      if (this._isClosed) {
        resolve()
        return
      }

      this.onClose(() => resolve())
    })
  }

}
