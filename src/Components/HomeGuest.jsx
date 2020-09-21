import React, {useContext, useState} from 'react'
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../Context/DispatchContext"

function HomeGuest() {
    const appDispatch = useContext(DispatchContext)

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post('/register', {
                username: user.username,
                email: user.email,
                password: user.password
            })
            if (response.data) {
                appDispatch({type: 'flashMessage', value: 'user was successfully created'})
            }
        } catch (e) {
            appDispatch({type: 'flashMessage', value: 'there was an error'})
        }
    }
    return (
        <Page title="Welcome!" wide>
            <div className="row align-items-center mb-5">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">Are you sick of short tweets and
                        impersonal &ldquo;shared&rdquo; posts that are
                        reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually
                        writing is the
                        key to enjoying the internet again.</p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username-register" className="text-muted mb-1">
                                <small>Username</small>
                            </label>
                            <input
                                onChange={handleChange}
                                value={user.username}
                                id="username-register"
                                name="username"
                                className="form-control"
                                type="text"
                                placeholder="Pick a username"
                                autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-register" className="text-muted mb-1">
                                <small>Email</small>
                            </label>
                            <input
                                onChange={handleChange}
                                value={user.email}
                                id="email-register"
                                name="email"
                                className="form-control"
                                type="text"
                                placeholder="you@example.com"
                                autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-register" className="text-muted mb-1">
                                <small>Password</small>
                            </label>
                            <input
                                onChange={handleChange}
                                value={user.password}
                                id="password-register"
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="Create a password"/>
                        </div>
                        <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                            Sign up for ComplexApp
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default HomeGuest;