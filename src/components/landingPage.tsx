import React from 'react';
import Login from './auth'
import { useSelector } from "react-redux"
import { userState, setUser, saveToken, setAuthState } from '../features/auth/userSlice';
import Dashboard from './diaries'
import store from '../store';
import Entries from './entries'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { removeDiaries } from '../features/diary/diariesSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapperDashboard: {
      backgroundColor: "white",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      textAlign: "center",
      margin: "0 auto",
      justifyContent: "space-evenly",
      paddingBottom: "2vh",

      alignItems: "flex-start"

    },
    loggedInHeading: {
      textAlign: "center",
      fontSize: "4vh",

    },
    signoutButton: {
      textAlign: "center",
      fontSize: "3vh",
      marginTop: "-1vh",
      marginBottom: "2vh"
    },

    headingWrapper: {
      backgroundColor: "rgba(164,198,241,1)",
      marginLeft: "4vw",
      marginRight: "4vw",

      boxShadow: "2px 5px 10px grey"

    }
  }),
);

function LandingPage() {

  const classes = useStyles();

  const user: userState = useSelector((state: any) => state.user);



  const clickHandleSignout = () => {

    store.dispatch(setUser(null))
    store.dispatch(saveToken(null))
    store.dispatch(setAuthState(false))
    store.dispatch(removeDiaries())

  }

  return (
    <div >
      {!!user.user ?
        <div >
          <div className={classes.headingWrapper}>
            <h1 className={classes.loggedInHeading}>You are logged in as {user.user.username}</h1>
            <div className={classes.signoutButton}>
              <Button onClick={clickHandleSignout}>Signout</Button>
            </div>
          </div>

          <div className={classes.wrapperDashboard}>
            <Dashboard></Dashboard>
            <Entries></Entries>
          </div>
        </div>
        : <Login></Login>}
    </div>
  );



}

export default LandingPage;
