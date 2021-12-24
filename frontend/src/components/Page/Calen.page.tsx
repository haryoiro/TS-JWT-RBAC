import { VStack, Spacer, Center } from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react'
import { usersSelectors, usersActions } from '../../state/users.state';import { CalendarComponent } from '../Calendar';
;
import { Header } from '../Nav';
import { UsersList } from '../UsersList';

export type DashBoardProps = {}

export const Calen: FC<DashBoardProps> = () => {
  return (
    <VStack>
      <Spacer />
      <Header></Header>
      <Center>
        <CalendarComponent />
      </Center>
      <Spacer />
    </VStack>
  )
};
