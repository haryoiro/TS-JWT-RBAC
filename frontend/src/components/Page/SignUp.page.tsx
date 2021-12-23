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
import Auth, { ISignUpValue } from "../../services/auth.service"
import { Form } from "../Forms/Form"
import { Header } from "../Nav"
import validator from "validator"
import { Redirect, useHistory } from "react-router"
import { authActions } from "../../state/auth.state"
const { isEmail } = validator

// TODO: validation処理を一か所にまとめる。
// TODO: テスト
const validEmail = (value: string) => {
  if (!isEmail(value)) {
    return "メールアドレスの形式が不正です"
  }
}

const validMinMax = (value: string, tag:string, min?: number, max?: number) => {
  if (min && value.length <= min) return `${tag}は${min}文字以上必要です。`
  if (max && value.length >= max) return `${tag}は${max}文字以下である必要があります。`
}

export const SignUp: React.FC = () => {
  const history = useHistory()
  const { register, watch, handleSubmit, formState } = useForm<ISignUpValue>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  const handleOnSubmit: SubmitHandler<ISignUpValue> = async ({ username, password, email}) => {
    const res = await authActions.useSignUp(username, password, email)
    if (!res) history.push("/login")
  }

  const handleOnError: SubmitErrorHandler<ISignUpValue> = (errors) => {
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
            Sign Up
          </Button>
        </form>
      </Center>
    </VStack>
  )
}