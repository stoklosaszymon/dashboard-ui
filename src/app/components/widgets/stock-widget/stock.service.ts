import { P } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { Observable, interval, of, scan, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {


  data = [125.5];
  interval = interval(1000)

  getTime(): Observable<string[]> {
    return this.interval.pipe(
      switchMap(() => {
        const time = (`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`);
        return of(time)
      }),
      scan((acc, curr) => [...acc, curr], [] as string[])
    )
  }

  getPrice(): Observable<number[]> {
    return this.interval.pipe(
      switchMap(() => {
        const price = this.data.at(-1)! + ((Math.random() * 20) - 10);
        this.data.push(price);
        return of(parseFloat(price.toFixed(2)))
      }),
      scan((acc, curr) => [...acc, curr], [] as number[])
    )
  }
}
