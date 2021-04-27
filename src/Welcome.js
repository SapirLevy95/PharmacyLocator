import "./App.css"
import React, { useState } from 'react';
import { logIn, signUp, printAllUsers, user_db, isUsernameExists } from './UserManagementUtils'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function Welcome(props) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [mode, setMode] = useState('logIn');

  // const { setUser } = props
  const setUser = props.setUser

  const cleanMessages = () => {
    setSuccessMessage('')
    setMessage('')
  }

  const onLogIn = async () => {
    cleanMessages()
    const user = await logIn(userName, password)
    if (user) {
      setUser(user)
    } else {
      setMessage('Wrong user name or password')
      setPassword('')
    }
  }

  const onSignUp = async () => {
    cleanMessages()
    if (!userName || !password) {
      setMessage('missing user or password')
      return
    }

    if (await isUsernameExists(userName)) {
      setMessage('User is already exists')
      return
    }


    if (password != verifyPassword) {
      setVerifyPassword('')
      setMessage('password and verify password are differnt')
      return
    }
    const user = await signUp(userName, password)

    if (user) {
      setSuccessMessage('Sign up succeeded')
      setMode('logIn')
      setPassword('')


    } else {
      setMessage('Error')
      setUserName('')
      setPassword('')
      setVerifyPassword('')
    }
  }

  const onSwitchMode = (x => {
    cleanMessages()
    if (mode == 'logIn') {
      setMode('signUp')
    } else {
      setMode('logIn')
    }
  })

  const text = mode === 'logIn' ? 'Log in' : 'Sign up'
  return (
    <div className='box' style={{ width: '300px', padding: '10px' }}>
      <div>
        <h3>Please {text}</h3>
        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
          <div style={{ padding: '5px' }}>
            <label>Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          <div style={{ padding: '5px' }}>
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {mode == 'signUp' ?
            <div style={{ padding: '5px' }}>
              <label>Verify Password</label>
              <input type="password" className="form-control" placeholder="Enter password again" value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} />
            </div> : null}
        </div>
        {message ? <div className="alert alert-danger" role="alert">{message}</div > : null}
        {successMessage ? <div class="alert alert-success" role="alert">{successMessage}</div > : null}
        <button className="btn btn-primary btn-block" onClick={mode === 'logIn' ? onLogIn : onSignUp}>{text}</button>
        <button className="btn btn-primary btn-block" onClick={onSwitchMode}>{mode === 'logIn' ? 'Change to sign up' : 'Change to log in'}</button>

      </div>
    </div>
  )
}
