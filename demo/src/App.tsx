//start demo
import "./App.css";
import FlagshipProvider from "@flagship.io/react-sdk";
import { Item } from "./Item";
import { Container, FormControlLabel, Grid, Switch } from "@mui/material";
import { useState } from "react";

function App() {
  const [isVip, setIsVip] = useState(false);
  return (
    <Container maxWidth="xs">
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              checked={isVip}
              onChange={() => setIsVip(!isVip)}
            />
          }
          label="Is vip client"
        />
      </Grid>
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
      >
        <Item />
      </FlagshipProvider>
    </Container>
  );
}

export default App;
//end demo
