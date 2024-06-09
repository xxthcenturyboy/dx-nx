import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export class DxDateUtilClass {
  public static getTimestamp(
    duration?: number,
    unit?: dayjs.ManipulateType,
    operator?: 'ADD' | 'SUB'
  ): number {
    if (duration && unit) {
      if (operator === 'ADD') {
        return dayjs.utc().add(duration, unit).unix();
      }
      if (operator === 'SUB') {
        return dayjs.utc().subtract(duration, unit).unix();
      }
    }

    return dayjs.utc().unix();
  }

  public static getTimestampFromDate(
    date: dayjs.ConfigType,
    duration?: number,
    unit?: dayjs.ManipulateType,
    operator?: 'ADD' | 'SUB'
  ): number {
    let d = date;
    if (
      date === null
      || date === undefined
      || date === 'now'
    ) {
      d = dayjs.utc();
    }
    if (duration && unit) {
      if (operator === 'ADD') {
        return dayjs.utc(d).add(duration, unit).unix();
      }
      if (operator === 'SUB') {
        return dayjs.utc(d).subtract(duration, unit).unix();
      }
    }

    return dayjs.utc(d).unix();
  }
}

export type DxDateUtilClassType = typeof DxDateUtilClass.prototype;
