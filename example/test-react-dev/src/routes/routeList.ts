import { RouteItem } from "../@types/types"
import Hits from "../pages/Hits"
import Home from "../pages/Home"
import Logs from "../pages/Logs"


const routes:RouteItem[] = [
    { path: '/', element: Home, key: 'Home' },
    { path: '/hits', element: Hits, key: 'Hits' },
    { path: '/logs', element: Logs, key: 'Logs' },
  ]
  
  export default routes