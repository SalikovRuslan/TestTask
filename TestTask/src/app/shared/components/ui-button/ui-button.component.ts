import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UiButtonComponent {
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() isDisabled: boolean = false;
}
