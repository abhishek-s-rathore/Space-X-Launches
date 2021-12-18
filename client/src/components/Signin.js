import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
function Signin(props) {
  let [state, setState] = useState({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
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
      passwordError = 'Password must contain a character and a Number';
    }
    return passwordError;
  }

  function handleInput({ target }) {
    let { name, value } = target;
    let errors = state.errors;
    switch (name) {
      case 'email':
        errors.email = validateEmail(value) ? '' : 'Email is not valid!';
        break;
      case 'password':
        errors.password = validatePassword(value);
        break;
      default:
        break;
    }
    setState({ ...state, errors, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = state;
    // Default options are marked with *
    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        user: {
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
        console.log(user);
        props.updateUser(user);
        props.history.push('/dashboard');
      })
      .catch((errors) => {
        setState((prevState) => {
          return {
            ...prevState,
            errors: {
              ...prevState.errors,
              email: 'Email or Password is incorrect!',
            },
          };
        });
      });
  }

  let { email, password } = state.errors;
  return (
    <>

          <div >
            <form >
              <h2 >Sign In</h2>
              
              <label >
                E-mail
              </label>
              <input
                value={state.email}
                onChange={handleInput}
                type='text'
                id='email'
                name='email'
                placeholder='Email'
               
              />
              <span >{email}</span>
              <label >
                Password
              </label>
              <input
                value={state.password}
                onChange={handleInput}
                type='password'
                id='password'
                name='password'
                placeholder='Password'
                
              />
              <span >{password}</span>
              <button
                type='button'
                className='btn'
                onClick={handleSubmit}
              >
                Login
             
              </button>
            </form>

            {state.isLoggedIn ? <p>user loggedin</p> : ''}
          </div>
          <div class='py-5'>
            <div>
              <div className='back-to-home container flex justify-center align-center'>
                <button className='btn'>
        
                  <NavLink className=' back' to='/'>
                    {' '}
                    Back to Home
                  </NavLink>
                </button>
              </div>
            </div>
          </div>
    </>
  );
}
export default withRouter(Signin);
