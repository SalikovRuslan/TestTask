import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

 export interface ISnackbarConfig {
  content: string;
  type: 'success' | 'warning';
  position?: 'top-left' | 'top-right';
}
@Component({
  selector: 'app-ui-snackbar',
  templateUrl: './ui-snackbar.component.html',
  styleUrls: ['./ui-snackbar.component.scss'],
  standalone: true,
  imports: [CommonModule, NgClass],
})
export class UiSnackbarComponent {
  @Input() config: ISnackbarConfig;
  private closeCallback: () => void;

  setCloseCallback(callback: () => void) {
    this.closeCallback = callback;
  }

  closeSnackbar() {
    this.closeCallback();
  }
}
