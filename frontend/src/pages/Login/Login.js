import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
// import '../../index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
const validator = require('validator')


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error: backendError, isLoading } = useLogin()
  const [emptyFields, setEmptyFields] = useState('')
  const [error, setError] = useState(null)



  const handleSubmit = async (e) => {

    const emptyFields = [];
    let error = '';

    e.preventDefault()

    if (!email) {
      emptyFields.push('email')
    }

    if (!password) {
      emptyFields.push('password')
    }

    if (emptyFields.length === 0) {
      if (validator.isEmail(email)) {
        await login(email.trim(), password.trim())
        if (backendError) {
          error = backendError
        }
      }
      else {
        error = 'Email is not valid'
      }
    }
    else {
      error = 'Fill in all the fields'
    }
    setEmptyFields(emptyFields)
    setError(error)
  }

  return (
    <div className="login">
      <div className="login-bg">
        <div className="login-container text-c">
          <div>
            <h1 className="logo-badge text-whitesmoke"><span><FontAwesomeIcon icon={faUserCircle} /></span></h1>
          </div>
          <h3 className="text-whitesmoke">Sign In</h3>
          <div className="container-content">
            <form className="margin-t" onSubmit={handleSubmit}>
              <div>
                <input
                  className={emptyFields.includes('email') ? 'login-input-error' : 'login-input'}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email} />
              </div>
              <div>
                <input
                  type="password"
                  className={emptyFields.includes('password') ? 'login-input-error' : 'login-input'}
                  placeholder="*****"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <button disabled={isLoading} type="submit" className="login-btn login-btn-effect">Sign In</button>
              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </div>
      </div >
    </div>
  )
}

export default Login