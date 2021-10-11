import { VStack, Spacer } from '@chakra-ui/react';
import { Header } from "../../Header"
import React from 'react'


export type AdminDashboardProps = { }

const AdminDashboard: React.FC<AdminDashboardProps> = ({  }) => {
    return (
        <VStack>
            <Spacer />
            <Header></Header>
            <Spacer />
        </VStack>
    )
};

export default AdminDashboard;