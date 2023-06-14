'use client'

import { useFsFlag } from '@flagship.io/react-sdk'

export default function Csr () {
  const flag = useFsFlag('btnColor', '#dc3545')
  return (
        <>
            <h1>This page is rendered client client only</h1>
            <p>flag key: btnColor</p>
            <p>flag value: {flag.getValue()}</p>
            <button style={{ background: flag.getValue() }} >Click me</button>
        </>
  )
}
