import React from 'react'
import './Login.css'
import { API } from './API/Api'
import { UserContext, ModalContext } from './Context/Contexts';
import EnterID from './EnterID';
import { Redirect } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';

function Login(){

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [loginError, setLoginError] = React.useState(false)
    const [fieldsError, setFieldsError] = React.useState(false)
    const [forgotClicked, setForgotClicked] = React.useState(false)

    const {setDisplay} = React.useContext(ModalContext)
    const {setUser, setUserSession, setWishList, wishList} = React.useContext(UserContext)
    const [showPass, setShowPass] = React.useState(false)


    const handleLogin = (e) =>{
        e.preventDefault();

        setFieldsError(false)
        setLoginError(false)
        
        if(email.trim() == '' || password.trim() == ''){
            setFieldsError(true)
            return
        }else{
            setLoading(true)
        }
        
        let url = "auth/jwt/create/"
        let body = JSON.stringify({
            email : email,
            password : password
        })

        API.post(url, body, {
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then(data =>{
            console.log('resposne : ' + JSON.stringify(data))
            localStorage.setItem('refresh_token', data.data.refresh)
            localStorage.setItem('access_token', data.data.access)
            getUserData()
        })
        .catch(e =>{
            console.log(e)
            setLoading(false)
            setLoginError(true)
        })
    }

    const getUserData = () =>{
        let url = "auth/users/me/"
        API.get(url,{
            headers: {
                'Authorization' : 'JWT ' + localStorage.getItem('access_token')
            }
        })
        .then(data => {
            console.log("success : " + JSON.stringify(data))
            setLoading(false)
            setDisplay(false)
            setUser(JSON.stringify(data.data))
            localStorage.setItem('user', JSON.stringify(data.data))
            setUserSession(JSON.stringify(data.data))
            localStorage.setItem('wishlist', JSON.stringify(data.data.wishlist))
            setWishList(JSON.stringify(data.data.wishlist))
            
            //getWishList(data.data.id)
            
        })
        .catch(e => {
            console.log("failed catched error : " + e)
            setLoading(false)
            setLoginError(true)
            
        });
    }
    
    if(forgotClicked){
        setDisplay(false)
        return(
            <Redirect to='/resetPassword'/>
        )
    }
    
    return (
        <div className="loginForm">
            <form>
                <div className="inputField">
                    <label for="uname"><b>Username</b></label>
                    <input type="text" placeholder="Enter Email" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required></input>
                </div>
                <div className="inputField">
                    <div id='passField'>
                        {showPass?(
                            <>
                            <input type="text" placeholder="Enter Password" name="password" value={password} onChange={(e) => {
                                setPassword(e.target.value)
                            }} required></input>
                            <VisibilityIcon id='showPass' onClick={() => setShowPass(false)}/>
                            </>
                        ):(
                            <>
                            <input type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => {
                                setPassword(e.target.value)
                            }} required></input>
                            <VisibilityIcon id='hidePass' onClick={() => setShowPass(true)}/>
                            </>
                        )}
                    </div>
                </div>
                {loginError?(
                    <div id='loginError' align='center'>
                        <p>Invalid Email or Password</p>
                    </div>
                ):(null)}

                {fieldsError?(
                    <div id='loginError' align='center'>
                        <p>Fields Cannot be Empty</p>
                    </div>
                ):(null)}

                <button type="submit" onClick={handleLogin}>LOGIN</button>
                <div id="bottomText">
                    <label>
                        <input type="checkbox" name="remember"></input> Remember me
                    </label>
                    <small id='forgot' onClick={() => setForgotClicked(true)}>Forgot Password?</small>
                </div>
                {loading?(
                    <div align='center'>
                        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    </div>
                ):(null)}
            </form>
        </div>
    )
    
    
}

export default Login