import React, {useEffect, useState} from 'react'
import Page from "./Page"
import Axios from "axios"
import {Link, useParams} from 'react-router-dom'


function ViewSinglePost() {
    const {id} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`)
                setPost(response.data)
                setIsLoading(false)
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchPost()
    }, [])


    if (isLoading) return <Page title="...">
        <div>Loading...</div>
    </Page>

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between my-5">
                <h2>{post.title}</h2>
                <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"/></a>
          <a className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"/></a>
        </span>
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny"
                         src={post.author.avatar} alt="Avatar"/>
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content" style={{height: '22rem'}}>
                {post.body}
            </div>
        </Page>
    );
}

export default ViewSinglePost;