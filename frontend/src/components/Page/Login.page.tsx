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
import Auth, { ILoginValue, RoleList } from "../../services/auth.service"
import { Form } from "../Forms/Form"
import { Header } from "../Nav"
import { useMutation } from "react-query"
import { useHistory } from "react-router-dom"
import useSharedStore from "../../hooks/useSharedStore"
import { useEffect } from "react"
import { authActions, authSelectors } from "../../state/auth.state"

const validMinMax = (value: string, tag: string, min?: number, max?: number) => {
  if (min && value.length < min) return `${tag}は${min}文字以上必要です。`
  if (max && value.length >= max) return `${tag}は${max}文字以下である必要があります。`
}

// https://tech.stmn.co.jp/entry/2021/04/23/091310
export const Login: React.FC = () => {
  const history = useHistory()
  const doLogin = authActions.useLogin()
  const me = authSelectors.me()
  const { register, watch, handleSubmit, formState } = useForm<ILoginValue>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const onSubmit: SubmitHandler<ILoginValue> = async({ username, password }) => {
    await doLogin(username, password)

    if (me.role === RoleList.Admin) {
      await history.push("/admin/profile")
    }

    await history.push("/profile")
  }

  const onError: SubmitErrorHandler<ILoginValue> = (errors) => {
    console.log(errors)
  }

  return (
    <VStack>
      <Spacer />
      <Header></Header>
      <Spacer />

      <Center>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
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