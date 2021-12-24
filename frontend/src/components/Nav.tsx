import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authActions, authSelectors } from "../state/auth.state";


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
  const history = useHistory();
  const logout = authActions.useLogout()
  const loggedIn = authSelectors.loggedIn()

  const onClickLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <Box>
      {loggedIn ?
        <Button colorScheme="teal" onClick={() => onClickLogout()}>
          Logout
        </Button>
      :
      <>
        <Button colorScheme="teal" mr="4" onClick={() => history.push('/signup')}>
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