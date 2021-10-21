import { VStack, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import User from '../../services/user.service';
import { useMutation } from 'react-query';
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

export type AdminDashboardProps = { }

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    const { mutate } = useMutation(() => User.getAllUsers())

    useEffect(() => {
        mutate()
    },[])

    return (
        <VStack>
            <Spacer />
            {/* <Header></Header> */}
            <Spacer />
        </VStack>
    )
};

export default AdminDashboard;