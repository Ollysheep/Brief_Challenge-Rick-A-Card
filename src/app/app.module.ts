import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawButtonComponent } from './components/draw-button/draw-button.component';
import { CharacterCardComponent } from './components/character-card/character-card.component';

@NgModule({
  declarations: [AppComponent, DrawButtonComponent, CharacterCardComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
