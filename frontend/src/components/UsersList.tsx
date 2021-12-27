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
import { ModalCalendar } from './ModalCalendar';
import "./UserList.module.scss"

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
          <ModalCalendar />
        </Box>
        <Spacer />
        <Box>
          <Input placeholder='Filter' />
        </Box>
      </Flex>
      <hr />
      <Table size="sm" className="table scroll">
        <Thead>
          <Tr>
            <Th></Th>
            {Object.keys(USER_FIELD).filter(a => (a !== "ID")).map((field: string) => (
              <>
                <Th key={field} value={field} className="max-width">
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
            <tr key={user.id}>
              <td><input type="checkbox" /></td>
              <td className="max-width">{user.username}</td>
              <td><div className="max-width">{user.email}</div></td>
              <td className="max-width">{RoleList[user.role]}</td>
              <td>{user.isActive ? "Active": "Inactive"}</td>
              <td>{dayjs(user.createdAt).format(dayjsFormat)}</td>
              <td>{dayjs(user.updatedAt).format(dayjsFormat)}</td>
            </tr>
          ))}
        </Tbody>
        </Table>
      </div>
  )
};
