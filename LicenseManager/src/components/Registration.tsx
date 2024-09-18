import { useState, type ChangeEvent, type FormEvent} from "react";
import "../../public/css/Login.css"
import useLoginToggle from '../utils/login-sign';
import { useDispatch } from "react-redux";
import { AppDispatch} from "../types";
import {userLogin,userSignup} from "../redux/user/userSlice";
import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
function Registration() {
    const dispatch = useDispatch<AppDispatch>();
    const [, toggleloginmode] = useLoginToggle();
    const navigate = useNavigate();
    const [formValue, setformValue] = useState({
        email:'',
        username:'',
        password:''
    })

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setformValue((prev)=>({...prev,[name]:value}));
    }

    const handleSignup = async (e:FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        try {
            const result = (await dispatch(userSignup({email:formValue.email,username:formValue.username,password:formValue.password}))).payload;
            console.log(result);
            if(result.message){
                console.log(result.message);
                toggleloginmode();
                setformValue({
                    email:"",
                    username:"",
                    password:""
                });
                
                return toast.success(result.message);
            }

        } catch (error:any) {
            if (error && error.error) return toast.error(error.error);
            console.log(error);
        }
    }
    const handleLogin = async (e:FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        try {
            const result = await dispatch(userLogin({email:formValue.email,password:formValue.password})).unwrap();
            
            if(result.message){
                console.log("Login function");
                navigate("/home/dashboard");
            }
        } catch (error: any) {
            if (error && error.error) return toast.error(error.error);
            console.log(error);
        }
        
    }

  return (
    <>
    <div className="box">
      <ToastContainer autoClose={3000} theme="dark"/>
        <div className="box-form">
            <div className="left">
                <div className="overlay">
                    <h1>License Manager</h1>
                    <p>Welcome to License Manager, your one-stop solution for managing
                    software licenses. Please login to continue.</p>
                
                </div>
            </div>
            
            
            <div className="right" id='login'>
                <h5>Login</h5>
                <p>Don't have an account? <a style={{color:"blue",cursor:"pointer"}} onClick={toggleloginmode}>Create Your Account</a> it takes less than a minute</p>
                <form onSubmit={(e)=>handleLogin(e)}>
                    <div className="inputs">
                        <input type="email" required placeholder="email" name='email' id='email' value={formValue.email} onChange={(e)=>handleChange(e)}/>
                        <br />
                        <input type="password" minLength={8} required placeholder="password" name='password' id='password' value={formValue.password}  onChange={(e)=>handleChange(e)}/>
                    </div>
                    
                    <br /><br />
                                
                    <button type="submit">Login</button>
                </form>
            </div>

            <div className="right" id='signup'>
                <h5>Sign up</h5>
                <p>Already have an account? <a style={{color:"blue",cursor:"pointer"}} onClick={toggleloginmode}>Login Your Account</a> it takes less than a minute</p>
                <form onSubmit={(e)=>handleSignup(e)}>
                    <div className="inputs">
                        <input type="text" required placeholder="username" name='username' defaultValue={formValue.username} onChange={(e)=>handleChange(e)}/>
                        <br />
                        <input type="email" required placeholder="email" name='email' defaultValue={formValue.email} onChange={(e)=>handleChange(e)}/>
                        <br />
                        <input type="password" minLength={8} required placeholder="password" name='password' defaultValue={formValue.password}  onChange={(e)=>handleChange(e)}/>
                    </div>
                    
                    <br /><br />
                                
                    <button>Sign up</button>
                </form>
            </div>
            
        </div>
    </div>
    </>
  )
}

export default Registration