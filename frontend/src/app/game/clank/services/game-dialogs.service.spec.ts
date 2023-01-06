import { TestBed } from '@angular/core/testing';

import { GameDialogsService } from './game-dialogs.service';

describe('GameDialogsService', () => {
  let service: GameDialogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDialogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
