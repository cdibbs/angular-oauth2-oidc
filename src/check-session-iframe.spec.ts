/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Provider } from '@angular/core';

import { CheckSessionIFrame } from './check-session-iframe';

describe('CheckSessionIFrame', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        <Provider>{ provide: CheckSessionIFrame, useClass: CheckSessionIFrame }
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the service', inject([CheckSessionIFrame], (service: CheckSessionIFrame) => {
    expect(service).toBeTruthy();
  }));
});
