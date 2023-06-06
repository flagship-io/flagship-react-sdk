'use client'
import {
  useFsFlag
} from '@flagship.io/react-sdk'

export function MyFlagComponent () {
  const myFlag = useFsFlag('my_flag_key', 'default-value')
  return <p>flag value: {myFlag.getValue()}</p>
}
