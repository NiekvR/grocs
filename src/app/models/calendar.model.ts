export interface CalendarItem {
  id?: string;
  type: CalenderType;
  menu?: string;
  year?: number;
  week?: number;
  month?: number;
}

export enum CalenderType {
  WEEK,
  MONTH,
  YEAR
}
