"use client"
import React, { useState } from 'react';
import './styles.css'
import hyphenLogo from '../../assets/images/hyphen-logo.png'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { GiSoundWaves } from "react-icons/gi";

interface SignUpProps {
    setLoading : Function
  }

const SignUp = (props : SignUpProps) => {

    const { setLoading } = props


    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [wrongUser, setWrongUser] = useState(false)




    const validateUserSubmit = (username : string, password: string, email: string) => {

        if ( password === 'hello' && username === 'user@hyphencare.com') {

            setLoading(true)
            setWrongPassword(false)
            setWrongUser(false)
            
            setTimeout( () => { 

                setLoading(false)
                
            }   , 1500 ) 
      
        } else {
            setWrongPassword(true)
            setWrongUser(true)
        }

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {

        if (type === 'username') {

            setUsername(e.target.value)

        } else if (type === 'password') {

            setPassword(e.target.value)

        } else if ( type === 'email') {
            setEmail(e.target.value)
        }

    }



    const handleInputBlur = (type: string) => {
        if (type === 'username' && !username.trim()) {
            // Reset the label position if the username is empty
            setUsername('')
        } else if (type === 'password' && !password.trim()) {
            // Reset the label position if the password is empty
            setPassword('')
        }
    }



    // if (user) {
    //     return router.push("/dashboard")
    // }

    return (

        <div className='login-page-container'>

        <div className="container">

            {/* <img className='login-pic' src={hyphenLogo} alt="" /> */}
            <GiSoundWaves size={40}/>
            <div className='login-title'>Log in To Continue</div>

            <div className="inp">

            <input
                    className='login-input'
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => handleInputChange(e, 'username')}
                    onBlur={() => handleInputBlur('username')}
                />

                <label className={`login-label ${email ? 'up' : ''}`} htmlFor="email-input">Email</label>

            </div>

            { wrongUser ? <div style={{ color:"red"}}> Username is not available. </div> : null}


            <div className="inp">

            <input
                    className='login-input'
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    onBlur={() => handleInputBlur('email')}
                />

                <label className={`login-label ${username ? 'up' : ''}`} htmlFor="username-input">Username</label>

            </div>

            <div className="inp">

            <input
                    className='login-input-password'
                    type={ passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => handleInputChange(e, 'password')}
                    onBlur={() => handleInputBlur('password')}
                />

                <label className={`login-label ${password ? 'up' : ''}`} htmlFor="password-input">Password</label>
                <span className='password-eye' onClick={() => setPasswordVisible(!passwordVisible)}>{ passwordVisible ? <IoMdEye/> : <IoMdEyeOff/> }</span>

            </div>

            { wrongPassword ? <div style={{ color:"red"}}> password is incorrect or does not exist. </div> : null}

            <div style={{ display: 'flex' }}>

                <a className='forgot-password-signup' href="">Forgot Password? - Support</a>

            </div>

            <button className='login-btn' type="submit" onClick={() => validateUserSubmit(username,password,email)}>Sign Up</button>

            <a className='forgot-password-signup' href="/login" >Already have an account? Log In</a>
        </div>
        </div>

    )

}


export default SignUp