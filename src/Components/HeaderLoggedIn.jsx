import React from 'react';

function HeaderLoggedIn({setLoggedIn}) {

    const handleLogout = () => {
        localStorage.removeItem('complexAppToken')
        localStorage.removeItem('complexAppUsername')
        localStorage.removeItem('complexAppAvatar')
        setLoggedIn(false)
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"/>
            </a>
            <span className="mr-2 header-chat-icon text-white">
            <i className="fas fa-comment"/>
            <span className="chat-count-badge text-white"> </span>
          </span>
            <a href="#" className="mr-2">
                <img className="small-header-avatar"
                     src={localStorage.getItem('complexAppAvatar')} alt="Avatar"/>
            </a>
            <a className="btn btn-sm btn-success mr-2" href="/create-post">
                Create Post
            </a>
            <button
                onClick={handleLogout}
                className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    );
}

export default HeaderLoggedIn;