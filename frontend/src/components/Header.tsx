import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
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
  const token = window.localStorage.getItem("token")
  if (token) {
    return (
      <Box>
        <Button colorScheme="teal" mr="4" onClick={() => history.push('/register')}>
              Sign Up
        </Button>
        <Button colorScheme="teal" onClick={() => history.push('/login')}>Log in</Button>
      </Box>
    )
  }
  return (
    <Box>
      <Button colorScheme="teal" onClick={() => {
        Auth.logout()
        history.push('/login')
      }
      }>LogOut</Button>
    </Box>
  )
}