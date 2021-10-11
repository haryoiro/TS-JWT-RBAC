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
import Auth, { RoleList } from "../../services/auth.service"
import { Form } from "../Forms/Form"
import { Header } from "../Header"
import validator from "validator"
import { useMutation } from "react-query"
import { useHistory } from "react-router-dom"
import jwtDecode from "jwt-decode"

const validMinMax = (value: string, tag: string, min?: number, max?: number) => {
  if (min && value.length < min) return `${tag}は${min}文字以上必要です。`
  if (max && value.length >= max) return `${tag}は${max}文字以下である必要があります。`
}

type ValuesType = {
  username: string,
  password: string,
}

// https://tech.stmn.co.jp/entry/2021/04/23/091310
export const LoginForm: React.FC = () => {
  const mutation = useMutation((values: any) => Auth.login(values))
  const history = useHistory();
  const { register, watch, handleSubmit, formState } = useForm<ValuesType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const handleOnSubmit: SubmitHandler<ValuesType> = async (values) => {
    const res = await mutation.mutateAsync(values)
    const { Role }: { Role: RoleList }= jwtDecode(res)
    // if Admin
    if (Role === RoleList.Admin) {
      return history.push("/admin")
    }
    // if Not Admin
    return history.push("/profile")
  }

  const handleOnError: SubmitErrorHandler<ValuesType> = (errors) => {
    console.log(errors)
  }

  return (
    <VStack>
      <Spacer />
      <Header></Header>
      <Spacer />

      <Center>
        <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
          <Form
            id='username'
            type="text"
            labelName="username"
            errors={formState.errors}
            register={
              register('username', {
                required: '* は必須フィールドです。',
                validate: (value) => validMinMax(value, "ユーザ名", 6, 64)
              })
            } />
          <FormErrorMessage>{formState.errors.username}</FormErrorMessage>
          <Form
            id='password'
            type="password"
            labelName="password"
            errors={formState.errors}
            register={register('password', {
              required: '* は必須フィールドです。',
              validate: (value) => validMinMax(value, "パスワード", 8, 64)
            })}
          />
          <FormErrorMessage>{formState.errors.password}</FormErrorMessage>
          <Button mt={4} colorScheme="teal" type="submit" disabled={!formState.isDirty && formState.isSubmitting}>
            Login
          </Button>
        </form>
      </Center>
    </VStack>
  )
}