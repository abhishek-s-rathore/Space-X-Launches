import React, { useEffect } from "react";
import "../stylesheets/style.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import Dashboard from "./Dashboard";
class App extends React.Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  };

  signout = () => {
    this.setState({ isLoggedIn: false, user: null, isVerifying: true });
    localStorage.removeItem("app__user");
    this.componentDidMount();
    let {history} = this.props;
    history.push("/")
  };

  componentDidMount = () => {
    let storageKey = localStorage["app__user"];
    if (storageKey) {
      fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          authorization: `${storageKey}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        })
        .then(({ user }) => this.updatedUser(user))
        .catch((errors) => console.log(errors));
    } else {
      this.setState({ isVerifying: false });
    }
  };

  updatedUser = (user) => {
    this.setState({ isLoggedIn: true, user, isVerifying: false });
    localStorage.setItem("app__user", user.token);
  };

  render() {
    return (
      <div>
        <Router>
          <Header/>
          {this.state.isLoggedIn ? (
            <AuthenticatedApp
              user={this.state.user}
              updateUser={this.updatedUser}
              signout={this.signout}
            />
          ) : (
            <UnAuthenticatedApp updatedUser={this.updatedUser} />
          )}
        </Router>
      </div>
    );
  }
}
function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
      <Home/>
      </Route>
      <Route path="/Dashboard" exact>
        <Dashboard updateUser={props.updatedUser} signout={props.signout} />
      </Route>
      <Route path="/Signout" exact>
        <Home />
      </Route>
      <Route path="*" exact>
        <NotFound />
      </Route>
    </Switch>
  );
}

function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/Signin" exact>
        <Signin updateUser={props.updatedUser} />
      </Route>
      <Route path="/Signup" exact>
        <Signup updateUser={props.updatedUser} />
      </Route>
      <Route path="*" exact>
        <NotFound />
      </Route>
    </Switch>
  );
}
export default App;
