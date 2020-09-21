import React, {useContext, useEffect, useState} from 'react'
import Page from "./Page"
import Axios from "axios"
import {Link, useParams, useHistory} from 'react-router-dom'
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import StateContext from "../Context/StateContext"
import DispatchContext from "../Context/DispatchContext"

import LoadingDotsIcon from "./LoadingDotsIcon"
import NotFound from "./NotFound";


function ViewSinglePost() {
    const {id} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()
    const history = useHistory()

    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
                setPost(response.data)
                setIsLoading(false)
            } catch (err) {
                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchPost()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (!isLoading && !post) {
        return (
            <NotFound/>
        )
    }

    if (isLoading) return <Page title="...">
        <LoadingDotsIcon/>
    </Page>

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    const isOwner = () => {
        if (appState.loggedIn) {
            return appState.user.username === post.author.username
        }
        return false
    }

    const deleteHandler = async () => {
        const areYouSure = window.confirm("Do you really want to delete this post?")
        if (areYouSure) {
            try {
                const response = await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}})
                console.log(response.data)
                if (response.data === 'Success') {
                    appDispatch({type: "flashMessage", value: "Post was successfully deleted."})
                    history.push(`/profile/${appState.user.username}`)
                }
            } catch (err) {
                console.log('there was a problem.')
                console.log(err)
            }
        }

    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between my-5">
                <h2>{post.title}</h2>
                {
                    isOwner() && (
                        <span className="pt-2">
                  <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for='edit' className="text-primary mr-2">
                   <i className="fas fa-edit"/>
                </Link>
                    <ReactTooltip id="edit" className="custom-tooltip"/>{' '}

                            <a onClick={deleteHandler} href="#" data-tip="Delete" data-for="delete"
                               className="delete-post-button text-danger">
                  <i className="fas fa-trash"/>
             </a>
               <ReactTooltip id="delete" className="custom-tooltip"/>
         </span>
                    )
                }

            </div>
            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny"
                         src={post.author.avatar} alt="Avatar"/>
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content" style={{height: '22rem'}}>
                <ReactMarkdown source={post.body}
                               allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]}/>
            </div>
        </Page>
    );
}

export default ViewSinglePost;