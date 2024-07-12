import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}
}
