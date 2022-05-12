import type { NextPage } from 'next'
import {Flagship} from '@flagship.io/react-sdk'
import { ENV_ID, API_KEY } from '../config'
import Home from '../components/Home'

const Index: NextPage = () => {
return<Home/>
}

// This gets called on every request
export async function getServerSideProps() {
  
  const visitorData={
    id:"my_visitor_id_1",
    context:{
      age:20,
      cacheEnabled: true
    },
  }

  const flagship= Flagship.start(ENV_ID, API_KEY,{
    fetchNow:false
  })

  const visitor= flagship?.newVisitor({visitorId: visitorData.id, context: visitorData.context,})

  await visitor?.fetchFlags()

  // Pass data to the page via props
  return { props: { initialFlagsData: visitor?.getFlagsDataArray(), visitorData} }
}
export default Index
