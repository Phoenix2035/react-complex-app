import React, {useState} from 'react'
import './App.css'
import {Switch, Route} from "react-router-dom"

// My Components
import Header from "./Components/Header"
import HomeGuest from "./Components/HomeGuest"
import Home from "./Components/Home"
import Footer from "./Components/Footer"
import About from "./Components/About"
import Terms from "./Components/Terms"

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('complexAppToken'))

    return (
        <>
            <Header
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
            />
            <Switch>
                <Route exact path={'/'}>
                    {
                        loggedIn ? <Home/> : <HomeGuest/>
                    }
                </Route>

                <Route path={'/about-us'} render={props => <About/>}/>

                <Route path={'/terms'} render={props => <Terms/>}/>

            </Switch>

            <Footer/>


        </>
    );
}

export default App;
