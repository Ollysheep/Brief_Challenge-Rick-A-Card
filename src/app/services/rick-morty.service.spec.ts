/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RickMortyService } from './rick-morty.service';

describe('Service: RickMorty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RickMortyService],
    });
  });

  it('should ...', inject([RickMortyService], (service: RickMortyService) => {
    expect(service).toBeTruthy();
  }));
});
