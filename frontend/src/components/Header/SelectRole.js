import React from "react";
import Buttons from "../Buttons";
import "./styles.css";
import { Button, Grid, Typography } from "@mui/material";

export default function SelectRole({setRole, setRoleSelected}) {
  const roleTutor = () => {
    setRole("1");
    setRoleSelected(true);
  };

  const roleTutee = () => {
    setRole("2");
    setRoleSelected(true);
  };

  return (
    <div className="select-role">
    <Typography component="h3" variant="h5">당신의 역할은 무엇인가요?</Typography>
    <Grid container className="select-role-buttons" sx={{justifyContent:'space-around', mt:3}}>
      <Grid item>
        <Button className="role-selecter" onClick={roleTutor}>강의자</Button>
        </Grid>
      <Grid item>
        <Button className="role-selecter" onClick={roleTutee}>수강생</Button>
      </Grid>
    </Grid>
    </div>
  )
};