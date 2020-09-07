import React from 'react';
import './App.css';
import {Switch, Route} from "react-router-dom";

// My Components
import Header from "./Components/Header";
import HomeGuest from "./Components/HomeGuest";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Terms from "./Components/Terms";

function App() {
    return (
        <>

            <Header/>
            <Switch>
                <Route exact path={'/'}>
                    <HomeGuest/>
                </Route>

                <Route path={'/about-us'}>
                    <About/>
                </Route>

                <Route path={'/terms'}>
                    <Terms/>
                </Route>
            </Switch>

            <Footer/>


        </>
    );
}

export default App;
