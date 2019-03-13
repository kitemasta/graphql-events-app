import React, { Component, createRef } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = createRef();
    this.passwordEl = createRef();
  }

  static contextType = AuthContext;

  state = {
    isLogin: true
  }

  switchModeHandler = () => {
    const { isLogin } = this.state;
    this.setState({
      isLogin: !isLogin
    })
  }

  submitHandler = (e) => {
    e.preventDefault()
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    const { isLogin } = this.state;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }

        return res.json();
      })
      .then(resData => {
        const { data: { login } } = resData;

        if (login.token) {
          this.context.login(login.token, login.userId, login.tokenExpiration)
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  render() {
    const { isLogin } = this.state;
    const formName = isLogin ? 'Sign up' : 'Log in';

    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="name" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>Switch to {formName}</button>
        </div>
      </form>
    )
  };
}

export default AuthPage;