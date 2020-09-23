import React, {useEffect} from 'react'
import {useImmerReducer} from "use-immer"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import {CSSTransition} from "react-transition-group"
import Axios from "axios"

import StateContext from "./Context/StateContext"
import DispatchContext from "./Context/DispatchContext"

// My Components
import Header from "./Components/Header"
import HomeGuest from "./Components/HomeGuest"
import Home from "./Components/Home"
import Footer from "./Components/Footer"
import About from "./Components/About"
import Terms from "./Components/Terms"
import CreatePost from "./Components/CreatePost"
import ViewSinglePost from "./Components/ViewSinglePost"
import FlashMessages from "./Components/FlashMessages"
import Profile from "./Components/Profile"
import EditPost from "./Components/EditPost"
import NotFound from "./Components/NotFound"
import Search from "./Components/Search"


Axios.defaults.baseURL = 'http://localhost:8080'

function App() {
    const initialState = {
        loggedIn: !!localStorage.getItem('complexAppToken'),
        flashMessages: [],
        user: {
            token: localStorage.getItem('complexAppToken'),
            username: localStorage.getItem('complexAppUsername'),
            avatar: localStorage.getItem('complexAppAvatar')
        },
        isSearchOpen: false
    }

    const ourReducer = (draft, action) => {
        switch (action.type) {
            case 'login':
                draft.loggedIn = true
                draft.user = action.data
                return
            case 'logout':
                draft.loggedIn = false
                return
            case 'flashMessage':
                draft.flashMessages.push(action.value)
                return
            case 'openSearch':
                draft.isSearchOpen = true
                return
            case 'closeSearch':
                draft.isSearchOpen = false
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("complexAppToken", state.user.token)
            localStorage.setItem("complexAppUsername", state.user.username)
            localStorage.setItem("complexAppAvatar", state.user.avatar)
        } else {
            localStorage.removeItem("complexAppToken")
            localStorage.removeItem("complexAppUsername")
            localStorage.removeItem("complexAppAvatar")
        }
    }, [state.loggedIn])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages}/>
                    <Header/>
                    <Switch>
                        <Route path={'/profile/:username'} render={props => <Profile {...props} />}/>

                        <Route exact path={'/'}>
                            {
                                state.loggedIn ? <Home/> : <HomeGuest/>
                            }
                        </Route>

                        <Route path={'/about-us'} render={props => <About {...props} />}/>

                        <Route path={'/terms'} render={props => <Terms {...props} />}/>

                        <Route path={'/create-post'} render={props => <CreatePost {...props} />}/>

                        <Route exact path={'/post/:id'} render={props => <ViewSinglePost {...props} />}/>

                        <Route exact path={'/post/:id/edit'} render={props => <EditPost {...props} />}/>


                        <Route render={props => <NotFound {...props} />}/>


                    </Switch>

                    <CSSTransition
                        timeout={330}
                        in={state.isSearchOpen}
                        classNames="search-overlay"
                        unmountOnExit>
                        <Search/>
                    </CSSTransition>

                    <Footer/>

                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export default App;
