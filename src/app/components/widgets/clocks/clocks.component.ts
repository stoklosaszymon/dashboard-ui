import { Component, input } from '@angular/core';
import { timezones } from './clock/timezones';
import { ClockComponent } from './clock/clock.component';
import { WidgetBaseComponent } from '../../widget-base/widget-base.component';

@Component({
  selector: 'app-clocks',
  standalone: true,
  imports: [ClockComponent],
  templateUrl: './clocks.component.html',
  styleUrl: './clocks.component.scss'
})
export class ClocksComponent extends WidgetBaseComponent {
  timezones: string[] = [];
  count = input(1);
  
  ngOnInit() {
    this.setup();
  }

  setup() {
    for (let i = 0; i < this.count(); i++) {
      let random_number = Math.floor(Math.random() * timezones.length - 1) + 1;
      this.timezones.push(timezones[random_number]);
    }
  }
}
