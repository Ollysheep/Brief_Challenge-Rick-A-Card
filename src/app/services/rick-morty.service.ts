import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root',
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getRandomCharacter(): Observable<Character> {
    const randomId = Math.floor(Math.random() * 671) + 1;
    return this.http.get<Character>(`${this.apiUrl}/${randomId}`);
  }
}
