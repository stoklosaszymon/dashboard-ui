import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { map, tap, delay } from 'rxjs';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {

  http = inject(HttpClient);
  newsList$ = this.getNews();

  getNews() {
    const url = 'https://api.worldnewsapi.com/top-news?source-country=us&language=en';
    return this.http.get<NewsResponse>(url).pipe(
      map(resp => resp.top_news.map(e => e.news).reduce((acc, news) => [...acc, ...news])),
      tap((result) => console.log(result)
    ))
  }

  load = Array.from(Array(2).keys());

  openNews(news: News) {
    window.open(news.url, "_blank");
  }
}

interface NewsResponse {
  top_news: [{ news: News[] }]
}

interface News {
  id: number
  title: string
  text: string
  summary: string
  url: string
  image: string
  publish_date: string
  author: string
}