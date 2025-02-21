import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { interval, of, switchMap, tap } from 'rxjs';
import { timezones } from './timezones';

@Component({
    selector: 'app-clock',
    imports: [CommonModule],
    templateUrl: './clock.component.html',
    styleUrl: './clock.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent {
  hours_template = Array.from(Array(13).keys())
  timezone = input(this.setup());
  currentTime = signal<Date>(this.getDate());
  seconds = computed(() => this.currentTime().getSeconds());
  minutes = computed(() => this.currentTime().getMinutes());
  hours = computed(() => this.currentTime().getHours());

  s_timer = toSignal(
    interval(1000).pipe(
      tap(() => this.currentTime.set(this.getDate()))
    )
  );

  s_rotation = computed(() => this.seconds()! * 6);
  m_rotation = computed(() => this.minutes()! * 6);
  h_rotation = computed(() => (this.hours() * 30) + (this.minutes()! * 0.5));

  getDate() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: this.timezone() }))
  }

  setup(): string {
      const random_number = Math.floor(Math.random() * 10) + 1;
      return timezones[random_number];
  }

  sRotate() {
    return { transform: `rotate(${this.s_rotation()}deg)` }
  }

  mRotate() {
    return { transform: `rotate(${this.m_rotation()}deg)` }
  }

  hRotate() {
    return { transform: `rotate(${this.h_rotation()}deg)` }
  }

}
