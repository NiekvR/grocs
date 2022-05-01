import {Injectable} from '@angular/core';

import * as moment from 'moment';
import {CalendarItem, CalenderType} from '../../../models/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private FIRST_DAY_OF_WEEK = 1;

  constructor() {
    moment.defineLocale('nl', {
      parentLocale: 'en',
      months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
      weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
      week: {
        dow: this.FIRST_DAY_OF_WEEK,
        doy: moment.localeData('en').firstDayOfYear()
      }
    });
  }

  public format(date: Date, format: string): string {
    return moment(date).format(format);
  }

  public firstDayOfWeek(date: Date): Date {
    return moment(date).startOf('week').toDate();
  }

  public addDay(date: Date, days: number): Date {
    return moment(date).add(days, 'day').toDate();
  }

  public getYear(): CalendarItem[] {
    const items: CalendarItem[] = [];

    const weekNumber = moment().week();
    const maxWeeks = weekNumber + 53;
    let month = moment().startOf('week').month();
    let year = moment().startOf('week').year();

    for (let week = weekNumber; week < maxWeeks; week++) {
      const start = moment().week(week).startOf('week');
      const end = moment().week(week).endOf('week');
      items.push({
        type: CalenderType.WEEK,
        year: start.year(),
        week: start.week()
      });
      if (year !== end.year()) {
        items.push({
          type: CalenderType.YEAR,
          year: end.year()
        });
        year = end.year();
      }
      if (month !== end.month()) {
        items.push({
          type: CalenderType.MONTH,
          month: end.month()
        });
        month = end.month();
      }
    }

    return items;
  }

  public formatMonth(month: number) {
    return moment().month(month).format('MMMM');
  }

  public formatWeek(week: number) {
    return `${moment().week(week).startOf('week').format('D')} - ${moment().week(week).endOf('week').format('D')}`;
  }

  public getWeek() {
    return moment().week();
  }

  public getDay() {
    return moment().day();
  }
}
