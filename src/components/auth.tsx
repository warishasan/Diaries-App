import React from 'react';
import store from '../store';
import http from '../services/api';
import { AuthResponse } from '../services/mirage/routes/user';
import { User } from '../Interfaces/user.interface';
import { fetchUser } from '../features/auth/userSlice';
import { userState } from '../features/auth/userSlice';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { useSelector } from "react-redux"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showAlert } from '../util';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authWrapper: {
      backgroundColor: "rgba(48,133,214,1)",
      margin: "0 auto",
      height: "100%",
      minHeight: "60vh",
      width: "50vh",
      textAlign: "center",
      boxShadow: "2px 4px 10px grey",
      borderStyle: "solid",
      display: "flex",
      flexDirection: "column",
      borderRadius: "10px"
    },
    loader: {

      textAlign: "center",
      marginBottom: "1vh"

    },
    authTitle: {
      fontSize: "5vh",
      textAlign: "center",
      textShadow: "2px 5px 10px rgba(48,133,214,1)",

    },
    formFieldWrapper: {
      fontSize: "3vh",
      display: "flex",
      flexDirection: "column",
      marginLeft: "2vh",
      marginRight: "2vh",
      marginTop: "4vh",
      fontWeight: "bold"
    },
    formFieldInput: {
      marginTop: "3vh",
      height: "2vh",
      backgroundColor: "lightBlue",
      borderStyle: "solid",
      borderColor: "black",
      fontSize: "2vh",
      padding: "1vh",
      borderRadius: "10px"
    },
    formFieldError: {
      color: "orange",
      fontWeight: "bold",
      fontSize: "2vh"
    },
    loginSignupButton: {

      marginTop: "4vh",
      width: "15vh",
      fontSize: "3vh",
      borderRadius: "10px"
    },

    clickHereWrapper: {
      marginTop: "8vh",
      display: "flex",
      flexDirection: "column",
      marginBottom: "4vh"

    },
    clickHereText: {
      fontSize: "3vh",
      fontStyle: "italic"
    },
    clickHereButton: {
      backgroundColor: "rgba(0,0,0,0)",
      borderStyle: "none",
      fontSize: "3vh",
      fontStyle: "italic",
      textDecoration: "underline",
      color: "white",
      marginRight: "2px"
    },
    error: {
      textAlign: "center"
    }


  }),
);




function Login() {

  const classes = useStyles();


  const user: userState = useSelector((state: any) => state.user);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"login" | "signup">("login")

  const schema = Yup.object().shape({
    username: Yup.string()
      .required('Username required!')
      .max(20, 'Username cannot be longer than 20 characters'),
    password: Yup.string().required('Password required!'),
    email: Yup.string().email('Please provide a valid email address (abc@xy.z)'),
  });

  const { handleSubmit, register, errors } = useForm<User>({
    resolver: yupResolver(schema)
  });


  const submitForm = (data: User) => {
    if (mode === "login") {
      store.dispatch(fetchUser({ username: data.username, password: data.password }));
    }

    else {

      setLoading(true);
      http
        .post<User, AuthResponse | Response>("/auth/signup", data)
        .then((res) => {
          if (res) {
            console.log(res)
            setMode("login")
          }

        })
        .catch((error) => {
          console.log(error.response.data.data.message);
          showAlert(error.response.data.data.message, 'error');
        })
        .finally(() => {
          setLoading(false);
        });

    }

  };

  console.log(loading)
  console.log(user.isLoading)
  if (user.error) {

    return (
      <h1 className={classes.error}>There was an unexpected error during authentication</h1>
    )
  }

  return (
    <div>
      <h1 className={classes.authTitle}>{mode.toUpperCase()}</h1>


      {(user.isLoading || loading) && <div className={classes.loader}><CircularProgress /></div>}

      <div className={classes.authWrapper} >
        <form onSubmit={handleSubmit(submitForm)}>
          <label className={classes.formFieldWrapper} >Username
    <input className={classes.formFieldInput} name="username" ref={register} type="text" ></input>
          </label>
          {errors && errors.username && (
            <p className={classes.formFieldError}>{errors.username.message}</p>
          )}
          <label className={classes.formFieldWrapper}>Password
    <input className={classes.formFieldInput} name="password" ref={register} type="password" ></input>
          </label>
          {errors && errors.password && (
            <p className={classes.formFieldError} >{errors.password.message}</p>
          )}

          {mode === "signup" && (

            <label className={classes.formFieldWrapper} >Email
              <input className={classes.formFieldInput} name="email" ref={register} type="email" ></input>
            </label>
          )}
          {errors && errors.email && (
            <p className={classes.formFieldError} >{errors.email.message}</p>
          )}





          <input className={classes.loginSignupButton} name="submit" ref={register} type="submit" value={mode.toUpperCase()} ></input>

        </form>
        <div className={classes.clickHereWrapper}>
          {mode === "login" ? <span className={classes.clickHereText} >Don't have an account?</span> : <span className={classes.clickHereText} >Already have an account?</span>}
          <div><button className={classes.clickHereButton} onClick={() => { mode === "login" ? setMode("signup") : setMode("login") }} >Click here</button>
            {mode === "login" ? <  span className={classes.clickHereText}>to signup</span> : <span className={classes.clickHereText}>to login</span>}</div>

        </div>

      </div>


    </div>

  )

}

export default Login;
