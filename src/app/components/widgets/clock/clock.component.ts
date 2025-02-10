import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { interval, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss'
})
export class ClockComponent {
  hours_template = Array.from(Array(13).keys())
  currentTime = signal<Date>(new Date());
  seconds = computed( () => this.currentTime().getSeconds());
  minutes = computed( () => this.currentTime().getMinutes());
  hours = computed( () => this.currentTime().getHours());

  s_timer = toSignal(
    interval(1000).pipe(
      tap( () => this.currentTime.set(new Date()))
    )
  );

  s_rotation = computed( () => this.seconds()! * 6);
  m_rotation = computed( () => this.minutes()! * 6);
  h_rotation = computed( () => (this.hours() * 30) + (this.minutes()! * 0.5));

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
