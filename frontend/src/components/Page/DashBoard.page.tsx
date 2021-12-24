import { VStack, Spacer, Center } from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react'
import User from '../../services/user.service';
import { useMutation } from 'react-query';
import { usersSelectors, usersActions } from '../../state/users.state';;
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
import { RoleList } from '../../services/auth.service';
import { Header } from '../Nav';
import { UsersList } from '../UsersList';

export type DashBoardProps = {}

export const DashBoard: FC<DashBoardProps> = () => {
    const init = usersActions.initUsers()
    const users = usersSelectors.all()

    useEffect(() => {
        init()
    }, [])

    return (
        <VStack>
            <Spacer />
            <Header></Header>
            <Center>
                <UsersList />
            </Center>
            <Spacer />
        </VStack>
    )
};
