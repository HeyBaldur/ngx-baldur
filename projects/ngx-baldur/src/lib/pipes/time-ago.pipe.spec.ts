import { TestBed } from '@angular/core/testing';
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeAgoPipe],
    });
    pipe = TestBed.inject(TimeAgoPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct time ago format', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(
      now.getTime() - 5 * 60 * 1000
    ).toISOString();
    const tenDaysAgo = new Date(
      now.getTime() - 10 * 24 * 60 * 60 * 1000
    ).toISOString();
    const twoMonthsAgo = new Date(
      now.getTime() - 2 * 30.416 * 24 * 60 * 60 * 1000
    ).toISOString();

    expect(pipe.transform(now.toISOString())).toBe('a few seconds ago');
    expect(pipe.transform(fiveMinutesAgo)).toBe('5 minutes ago');
    expect(pipe.transform(tenDaysAgo)).toBe('10 days ago');
    expect(pipe.transform(twoMonthsAgo)).toBe('2 months ago');
  });

  it('should return empty string for invalid date', () => {
    expect(pipe.transform('invalid-date')).toBe('');
  });
});
