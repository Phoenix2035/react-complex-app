import React, {useEffect, Suspense} from 'react'
import {useImmerReducer} from "use-immer"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import {CSSTransition} from "react-transition-group"
import Axios from "axios"


import StateContext from "./Context/StateContext"
import DispatchContext from "./Context/DispatchContext"

// My Components
import LoadingDotsIcon from "./Components/LoadingDotsIcon"
import Header from "./Components/Header"
import HomeGuest from "./Components/HomeGuest"
import Home from "./Components/Home"
import Footer from "./Components/Footer"
import About from "./Components/About"
import Terms from "./Components/Terms"

import FlashMessages from "./Components/FlashMessages"
import Profile from "./Components/Profile"
import EditPost from "./Components/EditPost"
import NotFound from "./Components/NotFound"


const CreatePost = React.lazy(() => import("./Components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./Components/ViewSinglePost"))
const Search = React.lazy(() => import("./Components/Search"))
const Chat = React.lazy(() => import("./Components/Chat"))

Axios.defaults.baseURL = process.env.BACKENDURL || "https://masturdating.herokuapp.com"


function App() {
    const initialState = {
        loggedIn: !!localStorage.getItem('complexAppToken'),
        flashMessages: [],
        user: {
            token: localStorage.getItem('complexAppToken'),
            username: localStorage.getItem('complexAppUsername'),
            avatar: localStorage.getItem('complexAppAvatar')
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
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
            case 'toggleChat':
                draft.isChatOpen = !draft.isChatOpen
                return
            case 'closeChat':
                draft.isChatOpen = false
                return
            case 'incrementUnreadChatCount':
                draft.unreadChatCount++
                return
            case 'clearUnreadChatCount':
                draft.unreadChatCount = 0
                return;
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


    // check if token has expired or not on first render
    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source()

            async function fetchResults() {
                try {
                    const response = await Axios.post('/checkToken', {token: state.user.token}, {cancelToken: ourRequest.token})
                    if (!response.data) {
                        dispatch({type: 'logout'})
                        dispatch({type: 'flashMessage', value: 'Your session has expired, Please login again.'})
                    }
                } catch (err) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }

            fetchResults()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages}/>
                    <Header/>
                    <Suspense fallback={<LoadingDotsIcon/>}>
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
                    </Suspense>

                    <CSSTransition
                        timeout={330}
                        in={state.isSearchOpen}
                        classNames="search-overlay"
                        unmountOnExit>
                        <div className="search-overlay">
                            <Suspense fallback=''>
                                <Search/>
                            </Suspense>
                        </div>
                    </CSSTransition>

                    <Suspense fallback=''>
                        {state.loggedIn && <Chat/>}
                    </Suspense>

                    <Footer/>

                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export default App;
