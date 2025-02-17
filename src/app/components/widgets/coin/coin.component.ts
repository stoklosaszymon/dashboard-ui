import { Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { WidgetBaseComponent } from '../../widget-base/widget-base.component';

@Component({
  selector: 'app-coin',
  standalone: true,
  imports: [],
  templateUrl: './coin.component.html',
  styleUrl: './coin.component.scss'
})
export class CoinComponent extends WidgetBaseComponent {

  random = signal(Math.floor((Math.random() * 30) + 10))
  coin = viewChild<ElementRef<HTMLDivElement>>('coin');

  randomEff = effect(() => {
    if (this.random()) {
      this.coin()?.nativeElement.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
      });
    }
  })

  toss() {
    this.random.set(Math.floor(Math.random() * 30) + 10)
  }

}
