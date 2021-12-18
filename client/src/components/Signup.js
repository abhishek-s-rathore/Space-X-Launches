import React, { useState } from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
function Signup(props) {
  let [state, setState] = useState({
    email: "",
    password: "",
    username: "",
    errors: {
      email: "",
      password: "",
      username: "",
    },
  });
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validatePassword(password) {
    let passwordError;
    if (password.length < 7) {
      passwordError = "Password can't be less than 6 characters";
    }
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
    if (!re.test(password)) {
      passwordError = "Password must contain a character and a Number";
    }
    return passwordError;
  }

  function handleInput({ target }) {
    let { name, value } = target;
    let errors = state.errors;
    switch (name) {
      case "email":
        errors.email = validateEmail(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password = validatePassword(value);

        break;
      case "confirmPassword":
        errors.confirmPassword = validatePassword(value);
        break;
      case "username":
        errors.username =
          value.length < 3 ? "Username must be at least 3 characters" : "";
        break;
      default:
        break;
    }

    setState({ ...state, errors, [name]: value });
  }
  function handleSubmit(event) {
    event.preventDefault();

    const { username, email, password } = state;
    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        user: {
          username,
          email,
          password,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        } else {
          return res.json();
        }
      })
      .then(({ user }) => {
        props.updateUser(user);
        setState({ ...state, username: "", password: "", email: "" });
        props.history.push("/Signin");
      })
      .catch((errors) => {
        setState({ ...state, errors });
      });
  }

  let { email, password, username } = state.errors;
  return (
    <>
      <div >
        <div >
          <form >
            <h2>Sign up</h2>
            <input
              value={state.username}
              onChange={handleInput}
              type="text"
           
              id="username"
              name="username"
              placeholder="User Name"
            />
            <span >{username}</span>
            <input
              value={state.email}
              onChange={handleInput}
              type="text"
              id="email"
             
              name="email"
              placeholder="Email"
            />
            <span >{email}</span>
            <input
              value={state.password}
              onChange={handleInput}
              type="password"
              id="password"
              name="password"
             
              placeholder="Password"
            />
            <span >{password}</span>
            <button
              type="submit"
              className='btn '
              onClick={handleSubmit}
             
              disabled={email || password || username}
            >
              Create Account
            </button>
          </form>

          <div  className='back-to-home container flex justify-center align-center'>
           <p> Already have an account?</p>
            <NavLink
            className='login'
              to="/signin"
            
            >
              {" "}
              Log in
            </NavLink>
            .
          </div>
        </div>
      </div>
    </>
  );
}
export default withRouter(Signup);
