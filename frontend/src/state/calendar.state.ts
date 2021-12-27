import { atom, useRecoilCallback, selector, useRecoilValue } from "recoil";
import { DayDetail } from "../helper/calendar";

/** --------
 * Atoms
 --------- */

type CalendarState = {
  selectedDate: DayDetail;
  calendar: DayDetail[][]
}

const calendarState = atom<CalendarState>({
  key: 'calendarState',
  default: {
    selectedDate: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() },
    calendar: [[{ year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() }]],
  },
});


/** --------
 * Actions
 --------- */

type CalendarActions = {
  setSelectedDate: () => (day: DayDetail) => void;
  setCalendar: () => (calendar: DayDetail[][]) => void;
}

export const calendarActions: CalendarActions = {
  setCalendar: () => useRecoilCallback(({ set }) => (calendar: DayDetail[][]) => {
    set(calendarState, (state) => {
      return {
        ...state,
        calendar
      }
    })
  }, []),
  setSelectedDate: () =>
    useRecoilCallback(
      ({ set }) =>
        (date: DayDetail) => {
          set(calendarState, (state) => {
            return {
              ...state,
              selectedDate: date,
            };
          });
        },
      []
    ),
};


/** --------
 * Selectors
 --------- */

type CalendarSelectors = {
  getSelected: () => DayDetail,
  getCalendar: () => DayDetail[][],
}

const getSelected = selector({
  key: 'getSelected',
  get: ({ get }) => {
    const state = get(calendarState);
    return state.selectedDate;
  },
});
const getCalendar = selector({
  key: 'getCalendar',
  get: ({ get }) => {
    const state = get(calendarState);
    return state.calendar;
  }
})

export const calendarSelectors: CalendarSelectors = {
  getSelected: () => useRecoilValue(getSelected),
  getCalendar: () => useRecoilValue(getCalendar),
};