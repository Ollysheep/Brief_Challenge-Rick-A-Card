/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DrawButtonComponent } from './draw-button.component';
import { RickMortyService } from '../../services/rick-morty.service';
import { of } from 'rxjs';
import { Character } from '../../models/character';

describe('DrawButtonComponent', () => {
  let component: DrawButtonComponent;
  let fixture: ComponentFixture<DrawButtonComponent>;
  let service: RickMortyService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DrawButtonComponent],
      providers: [RickMortyService, provideHttpClientTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawButtonComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RickMortyService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw a character and display it', waitForAsync(() => {
    const character: Character = {
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

    spyOn(service, 'getRandomCharacter').and.returnValue(of(character));

    component.drawCharacter();
    fixture.detectChanges();

    expect(component.character).toEqual(character);

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Rick Sanchez');
    expect(compiled.querySelector('img').src).toContain(character.image);
    expect(compiled.querySelector('.details').textContent).toContain(
      'Status: Alive | Species: Human | Character ID: 1'
    );
  }));

  it('should initialize lastDrawTime and drawnCharacters from localStorage on ngOnInit', () => {
    const storedTime = Date.now() - 1000;
    const storedCharacters = [1, 2, 3];

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'lastDrawTime') {
        return storedTime.toString();
      } else if (key === 'drawnCharacters') {
        return JSON.stringify(storedCharacters);
      }
      return null;
    });

    component.ngOnInit();
    expect(component.lastDrawTime).toBe(storedTime);
    expect(Array.from(component.drawnCharacters)).toEqual(storedCharacters);
  });

  it('should update canDraw based on lastDrawTime in checkDrawAvailability', () => {
    component.lastDrawTime = Date.now() - 3 * 60 * 60 * 1000; // 3 hours ago
    component.checkDrawAvailability();
    expect(component.canDraw).toBeTrue();

    component.lastDrawTime = Date.now();
    component.checkDrawAvailability();
    expect(component.canDraw).toBeFalse();
  });

  it('should fetch a new character if the same character is drawn again', waitForAsync(() => {
    const character1: Character = {
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

    const character2: Character = {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    component.drawnCharacters.add(character1.id);

    spyOn(service, 'getRandomCharacter').and.returnValues(
      of(character1),
      of(character2)
    );

    component.fetchNewCharacter();
    fixture.detectChanges();

    expect(component.character).toEqual(character2);
  }));

  it('should not draw a character if less than 2 hours have passed', () => {
    component.lastDrawTime = Date.now();
    component.canDraw = false;

    spyOn(service, 'getRandomCharacter');

    component.drawCharacter();
    expect(service.getRandomCharacter).not.toHaveBeenCalled();
  });
});
