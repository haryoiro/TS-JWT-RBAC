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
import { Form } from "../Forms/Form"
import { Header } from "../Header"
import validator from "validator"
import { Redirect } from "react-router"
import { useMutation } from "react-query"
import { useHistory } from "react-router-dom"
const { isEmail } = validator

const validEmail = (value: string) => {
  if (!isEmail(value)) {
    return "不正なアドレスです。"
  }
}
const validMinMax = (value: string, tag: string, min?: number, max?: number) => {
  if (min && value.length <= min) return `${tag}は${min}文字以上必要です。`
  if (max && value.length >= max) return `${tag}は${max}文字以下である必要があります。`
}

type ValuesType = {
  username: string,
  password: string,
}

// https://tech.stmn.co.jp/entry/2021/04/23/091310
export const Profile: React.FC = () => {

  return (
    <VStack>
      <Spacer />
      <Header></Header>
      <Spacer />

      <Center>
      </Center>
    </VStack>
  )
}