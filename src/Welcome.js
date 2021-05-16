import "./App.css"
import React, { useState } from 'react';
import { logIn, signUp, printAllUsers, user_db, isUsernameExists } from './UserManagementUtils'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.png'


export default function Welcome(props) {
  const [userName, setUserName] = useState('ספיר');
  const [password, setPassword] = useState('123');
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
      setMessage('שם המשתמש או הסיסמא אינו תקין')
      setPassword('')
    }
  }

  const onSignUp = async () => {
    cleanMessages()
    if (!userName || !password) {
      setMessage('חסר שם משתמש או סיסמא')
      return
    }

    if (await isUsernameExists(userName)) {
      setMessage('שם המשתמש כבר קיים')
      return
    }


    if (password != verifyPassword) {
      setVerifyPassword('')
      setMessage('אימות הסיסמא אינו תקין')
      return
    }
    const user = await signUp(userName, password)

    if (user) {
      setSuccessMessage('נרשמת בהצלחה!')
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



  const text = mode === 'logIn' ? 'התחברות' : 'הרשמה'
  return (
    <div className='box' style={{ width: '300px', padding: '10px', margin: "auto" }}>
      <div>
        <div style={{ textAlign: 'center' }}>
          <img src={logo} alt="Logo" />;
        <h3>{text}</h3>
        </div>

        <div style={{ marginBottom: '10px', direction: "rtl" }}>
          <div style={{ padding: '5px' }}>
            <label>אימייל</label>
            <input type="email" className="form-control" placeholder="הכנס אימייל" value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          <div style={{ padding: '5px' }}>
            <label>סיסמא</label>
            <input type="password" className="form-control" placeholder="הכנס סיסמא" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {mode == 'signUp' ?
            <div style={{ padding: '5px' }}>
              <label>אמת סיסמא</label>
              <input type="password" className="form-control" placeholder="אמת סיסמא" value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} />
            </div> : null}
        </div>
        {message ? <div className="alert alert-danger" role="alert">{message}</div > : null}
        {successMessage ? <div class="alert alert-success" role="alert">{successMessage}</div > : null}
        <button className="btn btn-primary btn-block" style={{ background: "#ff8100", borderColor: "#858585" }} onClick={mode === 'logIn' ? onLogIn : onSignUp}>{text}</button>
        <button className="btn btn-primary btn-block" style={{ background: "#ff8100", borderColor: "#858585" }} onClick={onSwitchMode}>{mode === 'logIn' ? 'עבור להרשמה' : 'עבור להתחברות'}</button>

      </div>
    </div>
  )
}
