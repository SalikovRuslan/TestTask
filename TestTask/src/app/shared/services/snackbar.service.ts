import {
  Injectable,
  ApplicationRef,
  Renderer2,
  RendererFactory2,
  createComponent
} from '@angular/core';

import { ISnackbarConfig, UiSnackbarComponent } from '@shared/components/ui-snackbar/ui-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private renderer: Renderer2;
  constructor(
    private appRef: ApplicationRef,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public success(content: string): void {
    this.createSnackbar({ content, type: 'success', position: 'top-right' });
  }

  public warning(content: string): void {
    this.createSnackbar({ content, type: 'warning', position: 'top-left' });
  }

  private createSnackbar(config: ISnackbarConfig) {
    const snackbarDiv = this.renderer.createElement('div');
    const snackbarComponent = createComponent(UiSnackbarComponent, { environmentInjector: this.appRef.injector });

    this.renderer.appendChild(snackbarDiv, snackbarComponent.location.nativeElement);
    this.appRef.attachView(snackbarComponent.hostView);
    snackbarComponent.instance.config = config;
    snackbarComponent.changeDetectorRef.detectChanges();

    const destroyCallback = () => {
      snackbarComponent.destroy();
      this.renderer.removeChild(document.body, snackbarDiv);
      this.appRef.detachView(snackbarComponent.hostView);
    }

    snackbarComponent.instance.setCloseCallback(destroyCallback);
    this.renderer.appendChild(document.body, snackbarDiv);

    setTimeout(() => {
      destroyCallback();
    }, 3000);
  }
}
