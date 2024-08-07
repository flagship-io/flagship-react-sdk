//start demo
//Path: demo/src/App.tsx
import { FlagshipProvider } from "@flagship.io/react-sdk";
import { Item } from "./Item";
import { Container } from "@mui/material";
import { useState } from "react";
import { VipSwitch } from "./VipSwitch";
import { Loading } from "./Loading";

function App() {
  const [isVip, setIsVip] = useState(false);
  return (
    <Container maxWidth="xs">
      <VipSwitch isVip={isVip} setIsVip={setIsVip} />
      {/* Step 1: Initialize the SDK with FlagshipProvider */}
      <FlagshipProvider
        envId="<ENV_ID>"
        apiKey="<API_KEY>"
        visitorData={{
          id: "visitor_id",
          hasConsented: true,
          context: {
            fs_is_vip: isVip,
          },
        }}
        loadingComponent={<Loading />}
      >
        <Item />
      </FlagshipProvider>
    </Container>
  );
}

export default App;
//end demo
