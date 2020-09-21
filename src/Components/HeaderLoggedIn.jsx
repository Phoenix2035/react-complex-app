import React, {useContext} from 'react'
import {Link, useHistory} from "react-router-dom"
import DispatchContext from "../Context/DispatchContext"
import StateContext from "../Context/StateContext"


function HeaderLoggedIn() {
    const history = useHistory()

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const handleLogout = () => {
        appDispatch({type: 'logout'})
        localStorage.removeItem('complexAppToken')
        localStorage.removeItem('complexAppUsername')
        localStorage.removeItem('complexAppAvatar')
        history.push('/')
    }

    const handleSearchIcon = () => {
        appDispatch({type: 'openSearch'})
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"/>
            </a>
            <span className="mr-2 header-chat-icon text-white">
            <i className="fas fa-comment"/>
            <span className="chat-count-badge text-white"> </span>
          </span>
            <Link to={`/profile/${appState.user.username}`} className="mr-2">
                <img className="small-header-avatar"
                     src={appState.user.avatar} alt="Avatar"/>
            </Link>
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>
            <button
                onClick={handleLogout}
                className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;