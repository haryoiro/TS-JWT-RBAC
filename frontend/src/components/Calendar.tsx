import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React, { FC, useEffect } from 'react';
import { atom, selector, useRecoilCallback, useRecoilValue } from 'recoil';
import { Calendar } from '../helper/calendar';

// calendar component
// <Calendar
//   onChange={(date) => {
//     setDate(date)
//   }}
//   value={date}
//   minDate={new Date()}
//   maxDate={new Date(2021, 11, 31)}
//   isOutsideRange={(day) => {
//     const start = new Date()
//     const end = new Date(2021, 11, 31)
//     return day < start || day > end
//   }}
// />
// const calendarState = atom({
//   key: "calendarState",
//   default: {
//     selectedDate: new Date(),
//     selectedDateString: "",
//     selectedDateRange: [],
//     selectedDateRangeString: "",
//     selectedDateRangeStart: "",
//     selectedDateRangeEnd: "",
//     selectedDateRangeStartString: "",
//     selectedDateRangeEndString: "",
//   }
// })

const calendarState = atom({
  key: 'calendarState',
  default: {
    selectedDate: new Date(),
  },
});

export const calendarActions = {
  setSelectedDate: () =>
    useRecoilCallback(
      ({ set }) =>
        (date: Date) => {
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

const getSelecter = selector({
  key: 'getSelected',
  get: ({ get }) => {
    const state = get(calendarState);
    return state.selectedDate;
  },
});

export const calendarSelectors = {
  getSelector: () => useRecoilValue(getSelecter),
};

export const CalendarMain: FC<{ year: number; month: number }> = ({
  year,
  month,
}) => {
  const setSelectedDate = calendarActions.setSelectedDate();
  const selected = calendarSelectors.getSelector();
  const cal = new Calendar();
  const caldata = cal.genDetailedCalendar(year, month);

  useEffect(() => {
    console.log('selected', selected.getDate());
  }, [selected]);

  return (
    <Table>
      <Thead>
        <Tr>
          {cal.getWeekName(true).map((week, i) => (
            <Th key={i}>{week}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {caldata.map((row, i) => (
          <Tr>
            {row.map((col, j) => {
              return selected.getDate() == col.day &&
                selected.getMonth() == col.month ? (
                // selected
                <Td key={`${i}-${j}`}>
                  <Box colorScheme="teal">{col.day}</Box>
                </Td>
              ) : (
                // not selected
                <Td
                  key={`${i}-${j}`}
                  onClick={() => {
                    setSelectedDate(new Date(year, month, col.day));
                  }}
                >
                  {col.day}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const CalendarSide: FC = () => {
  return (
    <Box>
      <Button>Month</Button>
      <Button>Week</Button>
      <Button>Day</Button>
    </Box>
  );
};

type ViewType = 'month' | 'year' | 'century';

export const CalendarComponent: FC = () => {
  return (
    <Box>
      <CalendarSide />
      <CalendarMain year={2021} month={1} />
    </Box>
  );
};
