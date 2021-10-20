import { VStack, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import User from '../../../services/user.service';
import { useMutation } from 'react-query';


export type AdminDashboardProps = { }

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    const [users, setUsers] = useState()
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