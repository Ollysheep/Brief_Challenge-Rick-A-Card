/* tslint:disable:no-unused-variable */
import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RickMortyService } from './rick-morty.service';
import { Character } from '../models/character';

describe('Service: RickMorty', () => {
  let service: RickMortyService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://rickandmortyapi.com/api/character';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RickMortyService, provideHttpClientTesting()],
    });

    service = TestBed.inject(RickMortyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a random character', () => {
    const dummyCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    service.getRandomCharacter().subscribe((character) => {
      expect(character).toEqual(dummyCharacter);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCharacter);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
