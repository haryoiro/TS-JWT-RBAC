import { VStack, Spacer, Center, Select, Button, Flex, Box, ButtonGroup, IconButton, Input } from '@chakra-ui/react';
import { ArrowUpDownIcon } from '@chakra-ui/icons'
import { useEffect, useState, FC, useCallback } from 'react'
import { usersSelectors, usersActions, USER_FIELD, SORT_ORDER } from '../state/users.state';
import dayjs from "dayjs"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"
import { RoleList } from '../services/auth.service';
import { SORT_USER_FIELD } from '../../../backend/src/types/types';

export type UsersListProps = {}
const dayjsFormat = "YYYY MMM D"

export const UsersList: FC<UsersListProps> = () => {
  const init = usersActions.initUsers()
  const users = usersSelectors.all()
  const setSortField = usersActions.setSortField()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div>
      <Flex>
        <Box>
          <Button colorScheme="red">Active</Button>
          <Button colorScheme="teal">Deactive</Button>
        </Box>
        <Spacer />
        <Box>
          <Input placeholder='Filter' />
        </Box>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            {Object.keys(USER_FIELD).map((field: string) => (
              <>
                <Th key={field} value={field}>
                  <ButtonGroup size='xs' isAttached variant='outline'>
                    <Button mr='-px' onClick={() =>
                    { setSortField(USER_FIELD[field as keyof typeof USER_FIELD])}
                    }>{field}</Button>
                    <IconButton aria-label='Sort' icon={<ArrowUpDownIcon />} />
                  </ButtonGroup>
                </Th>
              </>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {users?.map((user) => (
            <Tr key={user.id}>
              <Td><input type="checkbox" /></Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{RoleList[user.role]}</Td>
              <Td>{user.isActive ? "Active": "Inactive"}</Td>
              <Td>{dayjs(user.createdAt).format(dayjsFormat)}</Td>
              <Td>{dayjs(user.updatedAt).format(dayjsFormat)}</Td>
            </Tr>
          ))}
        </Tbody>
        </Table>
      </div>
  )
};
