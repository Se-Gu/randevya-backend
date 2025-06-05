export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TimeSlot {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
}

export interface WeeklyAvailability {
  day: DayOfWeek;
  slots: TimeSlot[];
}
