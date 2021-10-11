import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Auth from "../services/auth.service"

export const Header = () => {

  return (
    <Flex w="100%">
      <Box p="11">
        <Heading size="md">Chakra App</Heading>
      </Box>
      <Spacer />
      <LoginBoxes />
    </Flex>
  )
}

const LoginBoxes = () => {
  const history = useHistory();
  const [token, setToken] = useState<string|null>()
  useEffect(() => {
    setToken(window.localStorage.getItem("token"))
  },[token])

  return (
    <Box>
      {token ?
      <Button colorScheme="teal" onClick={async (e) => {
        e.preventDefault()
        await setToken(null)
        await Auth.logout()
        await history.push('/login')
      }
      }>LogOut</Button>
      :
      <>
        <Button colorScheme="teal" mr="4" onClick={() => history.push('/register')}>
          Sign Up
        </Button>
        <Button colorScheme="teal" onClick={() => history.push('/login')}>Log in</Button>
      </>
      }
    </Box>
  )
}