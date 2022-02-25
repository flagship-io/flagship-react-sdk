import type { NextPage } from 'next'
import Flagship from '@flagship.io/js-sdk'
import { ENV_ID, API_KEY } from '../config'
import Home from '../components/Home'

const Index: NextPage = () => {
return<Home/>
}

// This gets called on every request
// export async function getServerSideProps() {
  
//   const visitorData={
//     id:"visitor_1",
//     context:{
//       age:20
//     },
//   }

//   const flagship= Flagship.start(ENV_ID, API_KEY,{
//     fetchNow:false
//   })

//   const visitor= flagship?.newVisitor({visitorId: visitorData.id, context: visitorData.context,})

//   await visitor?.synchronizeModifications()

//   const campaigns = await visitor?.getAllModifications()

//   // Pass data to the page via props
//   return { props: { initialModifications: visitor?.getModificationsArray()||[], campaigns:campaigns?.campaigns } }
// }
export default Index
