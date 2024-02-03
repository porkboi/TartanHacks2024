import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import speakeasy from 'speakeasy';

const Home = (props) => {
    const { loggedIn, email, seed, setSeed, code, setCode } = props
    const [refreshTime, setRefreshTime] = useState(30)
    const navigate = useNavigate()

    const userSeed = seed; // Replace with the actual user's seed

    useEffect(() => {
        if (refreshTime === 0) {
            const secret = speakeasy.generateSecret();
            const res = speakeasy.totp({
                secret: seed
            });
            setCode(res)
            setRefreshTime(30)
        } 
        const interval = setInterval(() => {
            setRefreshTime(refreshTime - 1)
        }, 1000)
        return () => clearInterval(interval)}, [refreshTime])
    //     const updateTOTPCode = () => {
    //     const code = speakeasy.totp({
    //         secret: userSeed,
    //         encoding: 'base32',
    //     });
    //     setCode(code);
    //     };

    //     // Initial TOTP code
    //     updateTOTPCode();

    //     // Set up a timer to update the TOTP code every 30 seconds (adjust as needed)
    //     const intervalId = setInterval(updateTOTPCode, 30000);

    //     return () => {
    //     clearInterval(intervalId); // Cleanup timer
    //     };
    
    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    const onButtonClick2 = () => {
        if (loggedIn) {
            setSeed(JSON.parse(localStorage.getItem("user")).seed)
        }
    }

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the PLS Authentication Service.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick2}
                value={"Check for Token"} />
            {<div>
                Your OTP is {code}
            </div>}
        </div>

        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(loggedIn ? <div>
                Your email address is {email}
            </div> : <div/>)}
        </div>


    </div>
}

export default Home