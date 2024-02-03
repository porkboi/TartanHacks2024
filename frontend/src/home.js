import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import speakeasy from 'speakeasy';

const Home = (props) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const isAdmin = false
        fetch("http://localhost:3080/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email, password, isAdmin, ownerEmail: props.email})
        })
    };
    const { loggedIn, seed, setSeed, code, setCode } = props
    const [refreshTime, setRefreshTime] = useState(0)
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem("user"))

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
        return () => clearInterval(interval)
    }, [refreshTime])

    useEffect(() => {
        fetch('http://localhost:3080/getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: props.email }), // replace 'ownerEmail' with the actual owner's email
        })
        .then(response => response.json())
        .then(data => setUsers(data.users))
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }


    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the PLS Authentication Service.
        </div>
        {(loggedIn ? <div>
            Your OTP is {code}
        </div> : <div />)}


        {props.accountType === "admin" && (
    <div className={"adminContainer"} style={{ textAlign: 'center' }}>
        <table style={{ marginBottom: '20px' }}>
            <thead>
                <tr>
                    <th>Your Users</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ marginBottom: '10px' }}>
                Email:
                <input type="email" name="email" onChange={handleEmailChange} />
            </label>
            <label style={{ marginBottom: '20px' }}>
                Password:
                <input type="password" name="password" onChange={handlePasswordChange} />
            </label>
            <input type="submit" value="Create Account" />
        </form>
    </div>
)}

        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(loggedIn ? <div>
                Your email address is {props.email}
            </div> : <div />)}
        </div>



    </div>
}

export default Home