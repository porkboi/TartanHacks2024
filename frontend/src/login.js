import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [seed, setSeed] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    
    const navigate = useNavigate();
        
    const onButtonClick = () => {

        // Set initial error values to empty
        setEmailError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if ("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 2) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        if ("" === otp) {
            sendotp()
            return
        }
        else{
            logIn()
        }

        // Check if email has an account associated with it
        checkAccountExists(accountExists => {
            // If yes, log in 
            if (accountExists)
                logIn()
            else
            // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                    logIn()
                }
        })        
  

    }

    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback) => {
        fetch("http://localhost:3080/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email})
        })
        .then(r => r.json())
        .then(r => {
            callback(r?.userExists)
        })
    }

    const sendotp = () => {
        console.log(typeof email)
        //send an otp to the user
        console.log(JSON.stringify(email))
        fetch("http://localhost:3081/api/v1/sendotp", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({"email":email})
        })
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
          })
          .then(data => {
            // Handle the response data
            console.log(data);
          })
          .catch(error => {
            // Handle any errors
            console.error('There was a problem with your fetch operation:', error);
          })
        .then(window.alert("OTP sent to your email. Please key in to the OTP field."));
    }

    

    // Log in a user using email and password
    const logIn = () => {
        const isAdmin = true
        fetch("http://localhost:3080/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email, password, isAdmin, ownerEmail: ""})
        })
        .then(r => r.json())
        .then(r => {
            console.log(r)
            if ('success' === r.message) {
                localStorage.setItem("user", JSON.stringify({email, token: r.token, seed : r.seed, accountType: r.accountType}))
                props.setLoggedIn(true)
                props.setEmail(email)
                props.setSeed(r.seed)
                console.log(r.accountType)
                props.setAccountType(r.accountType)
                navigate("/")
            } else {
                window.alert("Wrong email or password")
            }
        })
    }

    const adminAdd = (ownerEmail) => {
        
    }

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={email}
                placeholder="Enter your email here"
                onChange={ev => setEmail(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                type = "password"
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                type ="otp"
                value={otp}
                placeholder="Enter your OTP here"
                onChange={ev => setOtp(ev.target.value)}
                className={"inputBox"} />
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div>
    </div>
}

export default Login