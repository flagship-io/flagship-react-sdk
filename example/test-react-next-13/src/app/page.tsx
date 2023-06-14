import styles from './page.module.css'
import { MyButtonSendHit } from '@/components/MyButtonSendHit'
import { MyFlagComponent } from '@/components/MyFlagComponent'
import React, { JSX } from 'react'

export default function Home (): JSX.Element {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Avoid flickering with NextJs SSR</h1>
        <p>flag key: my_flag_key</p>
        <MyFlagComponent />
        <MyButtonSendHit />
      </main>
    </div>
  )
}
