import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from "../state/auth.state"
import { useUserActions } from '../actions/user.action';

export const Header = () => {

  return (
    <Flex w="100%">
      <Box p="11">
        <Heading size="md">T</Heading>
      </Box>
      <Spacer />
      <LoginBoxes />
    </Flex>
  )
}

const LoginBoxes = () => {
  const auth = useRecoilValue(authAtom)
  const userActions = useUserActions()
  const history = useHistory();

  return (
    <Box>
      {auth ?
      <Button colorScheme="teal" onClick={userActions.logout}>
        LogOut
      </Button>
      :
      <>
        <Button colorScheme="teal" mr="4" onClick={() => history.push('/register')}>
          Sign Up
        </Button>
        <Button colorScheme="teal" onClick={() => history.push('/login')}>
          Log in
        </Button>
      </>
      }
    </Box>
  )
}