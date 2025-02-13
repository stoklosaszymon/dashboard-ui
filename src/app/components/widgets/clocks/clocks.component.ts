import { Component } from '@angular/core';
import { timezones } from './clock/timezones';
import { ClockComponent } from './clock/clock.component';

@Component({
  selector: 'app-clocks',
  standalone: true,
  imports: [ClockComponent],
  templateUrl: './clocks.component.html',
  styleUrl: './clocks.component.scss'
})
export class ClocksComponent {
  timezones: string[] = [];

  ngOnInit() {
    this.setup();
  }

  setup() {
    for (let i = 0; i < 1; i++) {
      let random_number = Math.floor(Math.random() * timezones.length - 1) + 1;
      this.timezones.push(timezones[random_number]);
    }
  }
}
