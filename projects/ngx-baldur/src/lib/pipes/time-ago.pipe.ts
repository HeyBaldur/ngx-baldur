import {
  Pipe,
  PipeTransform,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: number | null = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  /**
   * The function takes a string representing a date, calculates the time difference between that date
   * and the current time, and returns a human-readable string indicating how long ago the date was.
   * @param {string} value - The `value` parameter is a string representing a date or timestamp.
   * @returns a string representing the time elapsed between the input value and the current time. The
   * string is formatted as "a [time unit] ago" if the elapsed time is less than the corresponding time
   * unit, or as "[count] [time unit]s ago" if the elapsed time is greater than or equal to the
   * corresponding time unit. If the input value is not a valid date,
   */
  transform(value: string) {
    this.removeTimer();
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const timeToUpdate =
      (Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds)) *
      1000;

    this.timer = this.ngZone.runOutsideAngular(() => {
      return typeof window !== 'undefined'
        ? window.setTimeout(
            () => this.ngZone.run(() => this.changeDetectorRef.markForCheck()),
            timeToUpdate
          )
        : null;
    });

    const intervals = [
      { value: 1, label: 'second' },
      { value: 60, label: 'minute' },
      { value: 3600, label: 'hour' },
      { value: 86400, label: 'day' },
      { value: 2592000, label: 'month' },
      { value: 31536000, label: 'year' },
    ];

    for (const interval of intervals) {
      const count = Math.round(Math.abs(seconds / interval.value));
      if (count < interval.value) {
        return count === 0 || count === 1
          ? `a ${interval.label} ago`
          : `${count} ${interval.label}s ago`;
      }
    }

    return '';
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  /**
   * The function removes a timer if it exists.
   */
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * The function calculates the number of seconds until an update based on a given number of seconds.
   * @param {number} seconds - The `seconds` parameter is the number of seconds until the next update.
   * @returns the value of the "value" property of the first interval object in the "intervals" array
   * for which the "seconds" parameter is less than the "interval" property. If none of the intervals
   * match, the function returns 3600.
   */
  private getSecondsUntilUpdate(seconds: number) {
    const intervals = [
      { interval: 1, value: 2 },
      { interval: 60, value: 30 },
      { interval: 3600, value: 300 },
      { interval: 86400, value: 3600 },
    ];

    for (const interval of intervals) {
      if (seconds < interval.interval) {
        return interval.value;
      }
    }

    return 3600;
  }
}
