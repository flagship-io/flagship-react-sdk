import { FormControlLabel, Grid, Switch } from "@mui/material";

interface VipSwitchProps {
  isVip: boolean;
  setIsVip: (value: boolean) => void;
}

export function VipSwitch({ isVip, setIsVip }: VipSwitchProps) {
  return (
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
  );
}