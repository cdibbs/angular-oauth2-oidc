/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClassProvider, ValueProvider, Renderer } from '@angular/core';
import { LogServiceToken } from './i';

import { CheckSessionIFrame } from './check-session-iframe';

describe('CheckSessionIFrame', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        <ValueProvider>{ provide: LogServiceToken, useValue: console },
        <ValueProvider>{ provide: Renderer, useValue: null },
        <ClassProvider>{ provide: CheckSessionIFrame, useClass: CheckSessionIFrame }
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the service', inject([CheckSessionIFrame], (service: CheckSessionIFrame) => {
    expect(service).toBeTruthy();
  }));

  describe('navigate', () => {
    let iframe: CheckSessionIFrame;
    beforeEach(() => {
        inject([CheckSessionIFrame], (service: CheckSessionIFrame) => { iframe = service; })();
    });

    it('should timeout after specified period.', (done) => {
      iframe["setupGlobalListener"] = function() { return () => {}; };
      iframe.navigate("", 1).subscribe(
        (v: any) => { fail("Function success method called. Should be timeout."); done(); },
        (e: any) => { expect(e).toContain("timed out"); done();},
      );
    });
  });
});
