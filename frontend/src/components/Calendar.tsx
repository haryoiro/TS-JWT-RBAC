import React, { FC, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { HStack, Spacer, VStack } from '@chakra-ui/layout';
import { Calendar, DayDetail } from '../helper/calendar';
import "./Calendar.scss"
import { calendarActions, calendarSelectors } from '../state/calendar.state';

export const CalendarMain: FC<{ year?: number; month?: number }> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
}) => {
  const setSelectedDate = calendarActions.setSelectedDate();
  const setCalendar = calendarActions.setCalendar();
  const selected = calendarSelectors.getSelected();
  const caldata = calendarSelectors.getCalendar();
  const cal = new Calendar()

  useEffect(() => {
    setCalendar(new Calendar().genDetailedCalendar(year, month));
  }, [])

  return (
    <div className="calendar">
      <table className="table">
        <thead>
          <tr className="tr">
            {
              new Calendar().getWeekName(true).map((week, i) => {
                return (
                  <th key={i}>{week}</th>
                )
              })}
          </tr>
        </thead>
        <tbody>
          {caldata.map((row, i) => (
            <tr className="tr">
              {row.map((col, j) => {
                // console.log(col)
                return selected.day == col.day &&
                  selected.month == col.month ? (
                  // selected
                  <td key={`${i}-${j}`} className="active td">
                    <span>{col.day}</span>
                  </td>
                ) : (
                  // not selected
                  <td
                    key={`${i}-${j}`}
                      className={
                        //
                        `inactive
                        td
                        ${cal.isToday(col) ? 'today' : ''}
                        ${cal.isWeekend(col) ? 'weekend' : ''}
                        `}
                      onClick={() => {
                        if (col.month !== selected.month) {
                          setSelectedDate({ ...col, month: (col.month - selected.month), year: selected.year });
                          setCalendar(cal.genDetailedCalendar(col.year, col.month))
                        }
                        setSelectedDate({ ...col });
                      }}
                    >
                      <span>{col.day}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CalendarHeader: FC = () => {
  const setSelectedDate = calendarActions.setSelectedDate();
  const setCalendar = calendarActions.setCalendar();
  const selected = calendarSelectors.getSelected();


  const onClickNextMonth = () => {
    setSelectedDate({
      ...selected,
      month: selected.month >= 12 ? 1 : selected.month + 1,
      year: selected.month >= 12 ? selected.year + 1 : selected.year ,
    })
    setCalendar(new Calendar().genDetailedCalendar(selected.year, selected.month + 1));
  }

  const onClickPrevMonth = () => {
    setSelectedDate({
      ...selected,
      month: selected.month <= 1 ? 12 : selected.month - 1,
      year: selected.month <= 1 ? selected.year - 1 : selected.year,
    })
    setCalendar(new Calendar().genDetailedCalendar(selected.year, selected.month - 1));
  }

  return (
    <HStack>
      <button
        className="arrow-button"
        onClick={onClickPrevMonth}
      >
        <ChevronLeftIcon />
      </button>
      <Spacer />

      <select
        className="selectme"
        value={selected.month}
        placeholder={selected.month.toString()}>
        {Array.from({ length: 12 }, (_, i) => (
          <option value={i + 1}>{new Calendar().getMonthName(i + 1)}</option>
        ))}
      </select>

      <Spacer />

      <select
        className="selectme"
        value={selected.year}
        placeholder={selected.year.toString()}>
        {Array.from({ length: 100 }, (_, i) => (
          <option value={selected.year - i + 10}>{selected.year - i + 10}</option>
        ))}
      </select>

      <button
        className="arrow-button"
        onClick={onClickNextMonth}
      >
        <ChevronRightIcon />
      </button>
    </HStack>
  )
}


export const CalendarComponent: FC = () => {
  return (
    <VStack>
      <CalendarHeader />
      <CalendarMain />
    </VStack>
  );
};
