import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { WidgetBaseComponent } from '../../widget-base/widget-base.component';

@Component({
    selector: 'app-coin',
    imports: [],
    templateUrl: './coin.component.html',
    styleUrl: './coin.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoinComponent extends WidgetBaseComponent {

  random = signal(Math.floor((Math.random() * 2) + 1))
  coin = viewChild<ElementRef<HTMLDivElement>>('coin');
  v = signal<string[]>([])

  randomEff = effect(() => {
    if (this.random()) {
      this.v.update( (v) =>  [...v, this.random() % 2 == 0 ? 'H' : 'T'])
      this.coin()?.nativeElement.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
      });
    }
  })

  toss() {
    this.random.set(Math.floor(Math.random() * 20) + 10)
  }

}
