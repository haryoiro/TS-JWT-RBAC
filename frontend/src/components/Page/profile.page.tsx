import * as React from "react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Center,
  VStack,
  Spacer,
} from "@chakra-ui/react"
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import Auth from "../../services/auth.service"
import validator from "validator"
import { Header } from "../Nav"

// https://tech.stmn.co.jp/entry/2021/04/23/091310
export const Profile: React.FC = () => {

  return (
    <VStack>
      <Spacer />
        <Header />
      <Spacer />

      <Center>
      </Center>
    </VStack>
  )
}