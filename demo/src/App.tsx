//start demo
import "./App.css";
import FlagshipProvider from "@flagship.io/react-sdk";
import { Item } from "./Item";

function App() {
  return (
    <FlagshipProvider
      envId="<ENV_ID>"
      apiKey="<API_KEY>"
      visitorData={{
        id: "test-user-id", 
        hasConsented: true,
        context: {
          fs_is_vip: true,
        },
      }}
    >
      <Item />
    </FlagshipProvider>
  );
}

export default App;
//end demo