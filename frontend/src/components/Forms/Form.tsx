import * as React from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input
} from "@chakra-ui/react"
import { UseFormRegisterReturn } from 'react-hook-form'

type PropsType = {
  labelName: string,
  register: UseFormRegisterReturn,
  type: string | "text" | "password" | "email",
  id: string,
  errors: any
}

export const Form = (props: PropsType) => {
  const { id, labelName, register, type, errors } = props

  return (
    <FormControl id={id} isInvalid={errors[id]}>
      <FormLabel htmlFor={id}>{labelName}</FormLabel>
      <Input id={id} type={type} {...register} />
      <FormErrorMessage>
        {errors[id] && errors[id].message}
      </FormErrorMessage>
    </FormControl>
  )
}
