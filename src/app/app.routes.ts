import { Routes } from '@angular/router';
import { GameListComponent } from './features/game-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: 'games', component: GameListComponent },
];