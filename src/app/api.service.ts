import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError( () => { throw "API ERROR" })
    )
  }
}
