import { VStack, Spacer } from '@chakra-ui/react';
import React from 'react'


export type AdminDashboardProps = { }

const AdminDashboard: React.FC<AdminDashboardProps> = ({  }) => {
    return (
        <VStack>
            <Spacer />
            <Headers></Headers>
            <Spacer />
        </VStack>
  
    )
};

export default AdminDashboard;