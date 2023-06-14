import { getFsVisitorData } from '@/helpers/flagship'

export default async function Src () {
  const visitor = await getFsVisitorData()
  const flag = visitor.getFlag('btnColor', '#dc3545')
  await flag.visitorExposed()
  return (
        <>
            <h1>This page is a server component</h1>
            <p>flag key: btnColor</p>
            <p>flag value: {flag.getValue()}</p>
            <button style={{ background: flag.getValue() }} >Click me</button>
        </>
  )
}
