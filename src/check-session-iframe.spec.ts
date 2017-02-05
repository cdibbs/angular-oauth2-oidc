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
    fit('should timeout after specified period.', (done) => { inject([CheckSessionIFrame], (service: CheckSessionIFrame) => {
        //service["setupGlobalListener"] = function(target: string, name: string, callback: Function): Function { return () => {}; };
        spyOn(service, "setupGlobalListener");
        service.navigate("", 1).subscribe(
          (v: any) => { fail("Function success method called. Should be timeout."); },
          (e: any) => { expect(e).toContain("timed out"); },
          () => { done(); }
        );
    })(); });
  });
});
