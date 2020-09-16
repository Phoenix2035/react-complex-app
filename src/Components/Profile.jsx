import React, {useState, useEffect, useContext} from 'react'
import Page from "./Page"
import StateContext from "../Context/StateContext"
import {useParams} from 'react-router-dom'
import Axios from "axios"
import ProfilePosts from "./ProfilePosts";

function Profile() {
    const {username} = useParams()
    const appState = useContext(StateContext)

    const [profileData, setProfileData] = useState({
        profileUsername: '',
        profileAvatar: '',
        isFollowing: false,
        counts: {
            postCount: '',
            followerCount: '',
            followingCount: ''
        }
    })


    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, {token: appState.user.token}, {cancelToken: ourRequest.token})
                setProfileData(response.data)
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchData()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    return (
        <Page title='Profile Screen'>
            <h2 className='mt-5'>
                <img className="avatar-small"
                     src={profileData.profileAvatar}
                     alt='Profile'/> {profileData.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"/></button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePosts profileData={profileData}/>
        </Page>
    );
}

export default Profile;