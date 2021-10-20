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
import { Header } from "../Nav"
import validator from "validator"
import { Redirect, useHistory } from "react-router"
import { useMutation, useQueryClient } from "react-query"
const { isEmail } = validator

const validEmail = (value: string) => {
  if (!isEmail(value)) {
    return "メールアドレスの形式が不正です"
  }
}
const validMinMax = (value: string, tag:string, min?: number, max?: number) => {
  if (min && value.length <= min) return `${tag}は${min}文字以上必要です。`
  if (max && value.length >= max) return `${tag}は${max}文字以下である必要があります。`
}

type ValuesType = {
  username: string,
  email: string,
  password: string,
}

// https://tech.stmn.co.jp/entry/2021/04/23/091310
export const Register: React.FC = () => {
  const mutation = useMutation((values: any) => Auth.register(values))
  const history = useHistory();
  const { register, watch, handleSubmit, formState } = useForm<ValuesType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  const handleOnSubmit: SubmitHandler<ValuesType> = async (values) => {
    const res = await mutation.mutateAsync(values)
    if (res?.status == 200) return history.push("/login")
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
            id='email'
            type="text"
            labelName="email"
            errors={formState.errors}
            register={register('email', {
              required: 'メールアドレスは必須フィールドです。',
              validate: validEmail,
            })}
          />
          <FormErrorMessage>{formState.errors.email}</FormErrorMessage>
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