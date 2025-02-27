import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { TabsService } from './tabs.service';
import { debounceTime, fromEvent, switchMap, tap } from 'rxjs';

@Directive({
  selector: '[appTab]'
})
export class TabDirective {

  el = inject(ElementRef<HTMLDListElement>)
  tabService = inject(TabsService)

  update = fromEvent(this.el.nativeElement, 'input').pipe(
    debounceTime(500),
    switchMap(t => {
       const target = this.el.nativeElement as HTMLDListElement
       return this.tabService.updateTab({ name: target.innerHTML, id: parseInt(target.id) })
    })
  ).subscribe({
    next: (resp) => console.log('tab updated', resp)
  })
}
