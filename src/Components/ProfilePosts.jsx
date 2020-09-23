import React, {useState, useEffect} from 'react'
import Axios from "axios"
import {useParams, Link} from 'react-router-dom'

import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts() {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])


    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, {cancelToken: ourRequest.token})
                setPosts(response.data)
                setIsLoading(false)
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchPosts()

        return () => {
            ourRequest.cancel()
        }
    }, [])


    if (isLoading) return <LoadingDotsIcon/>
    return (
        <div className="list-group" style={{height: '15rem'}}>
            {
                posts.map(post => {
                    const date = new Date(post.createdDate)
                    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    return (
                        <Link key={post._id} to={`/post/${post._id}`}
                              className="list-group-item list-group-item-action">
                            <img className="avatar-tiny"
                                 src={post.author.avatar} alt='Profile'/>
                            <strong>{post.title}</strong>{' '}
                            <span className="text-muted small">on {dateFormatted} </span>
                        </Link>
                    )
                })}

        </div>
    );
}

export default ProfilePosts;