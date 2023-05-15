import React, { useContext } from 'react'
import { useFlagship, useFsFlag, HitType, DEVICE_LOCALE } from '@flagship.io/react-sdk'
import styles from './styles/Home.module.css'
import { appContext } from './main'

let count = 0
const Home = () => {
  const context = useContext(appContext)
  const fs = useFlagship()

  fs.updateContext({ [DEVICE_LOCALE]: 'fr' })

  const btnColorFlag = useFsFlag('js-qa-app', 'default')

  const onSendHitClick = () => {
    fs.hit.sendMultiple([
      { type: HitType.PAGE_VIEW, documentLocation: 'abtastylab' },
      { type: HitType.SCREEN, documentLocation: 'abtastylab' }
    ])
  }

  const onChangeVisitorIdClick = () => {
    count++
    // if (count === 5 || count === 7) {
    //   context.setVisitorData({})
    //   return
    // }
    if (count === 2) {
      context.setVisitorData((prev: any) => ({
        ...prev,
        id: 'my_visitor_id_' + count,
        isAuthenticated: true,
        context: {
          age: 20,
          cacheEnabled: true
        }
      }))
      return
    }
    if (count === 3) {
      context.setVisitorData((prev: any) => ({
        ...prev,
        id: 'my_visitor_id_' + (count - 1),
        isAuthenticated: false,
        context: {
          age: 20,
          cacheEnabled: true
        }
      }))
      return
    }

    if (count === 4) {
      context.setVisitorData((prev: any) => ({
        ...prev,
        id: 'my_visitor_id_' + count,
        isAuthenticated: true,
        context: {
          age: 20,
          cacheEnabled: true
        }
      }))
      return
    }

    if (count === 5) {
      context.setVisitorData((prev: any) => ({
        ...prev,
        id: 'my_visitor_id_' + count,
        isAuthenticated: true,
        context: {
          age: 20,
          cacheEnabled: true
        }
      }))
      return
    }

    if (count === 6) {
      context.setVisitorData((prev: any) => ({
        ...prev,
        id: 'my_visitor_id_' + count,
        isAuthenticated: false,
        context: {
          age: 20,
          cacheEnabled: true
        }
      }))
      return
    }

    context.setVisitorData((prev: any) => ({
      ...prev,
      id: 'my_visitor_id_' + count,
      context: {
        age: 20,
        cacheEnabled: true
      }
    }))
  }

  return (
    <div className={styles.container}>

      <main className={styles.main}>
      <h1>ViteJS</h1>
      <div>
        <button
          style={{ width: 100, height: 50 }}
          onClick={() => {
            onChangeVisitorIdClick()
          }}
        >Change visitor Id</button>
      </div>

        <p>flag: js-qa-app</p>
        <p>value: {btnColorFlag.getValue()}</p>

        <button
          style={{ width: 100, height: 50 }}
          onClick={() => {
            onSendHitClick()
          }}
        > Send hits</button>

      </main>

    </div>
  )
}

export default Home
