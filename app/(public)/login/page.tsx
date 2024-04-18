"use client"
import React, { useState } from 'react';
import './styles.css'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { GiSoundWaves } from "react-icons/gi";
import { createClient } from '@/utils/supabase/client';
import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';

interface LoginProps {
    setLoading : Function
  }

const Login = (props : LoginProps) => {

    const { setLoading } = props


    const router = useRouter()

    const supabase = createClient()


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [wrongUser, setWrongUser] = useState(false)




    const validateUserSubmit = async (username : string, password: string) => {

        if ( password && username) {

                const { error: LoginError } =
                  await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                  });

                  if (LoginError) {
                    toast.error(LoginError.message)
                  }
                  else {
                    router.push('/dashboard')
                  }
      
        } else {
            setWrongPassword(true)
            setWrongUser(true)
        }

    }



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {

        if (type === 'email') {

            setEmail(e.target.value)

        } else if (type === 'password') {

            setPassword(e.target.value)

        }

    }



    const handleInputBlur = (type: string) => {
        if (type === 'email' && !email.trim()) {
            // Reset the label position if the username is empty
            setEmail('')
        } else if (type === 'password' && !password.trim()) {
            // Reset the label position if the password is empty
            setPassword('')
        }
    }




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
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    onBlur={() => handleInputBlur('email')}
                />
                <label className={`login-label ${email ? 'up' : ''}`} htmlFor="email-input">Email</label>
            </div>
            { wrongUser ? <div style={{ color:"red"}}> Email is incorrect or does not exist. </div> : null}
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
            <button className='login-btn' type="submit" onClick={() => validateUserSubmit(email,password)}>Login</button>

            <a className='forgot-password-signup' href="/signup" >Don't have an account? Sign up</a>

        </div>
        </div>

    )

}


export default Login