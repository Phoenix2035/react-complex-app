import React, {useState, useContext} from 'react'
import Page from "./Page"
import Axios from "axios"
import {useHistory} from 'react-router-dom'
import DispatchContext from "../Context/DispatchContext"
import StateContext from "../Context/StateContext"


function CreatePost() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios.post('/create-post', {
                title,
                body,
                token: appState.user.token
            })
            appDispatch({type: 'flashMessage', value: 'Congrats, you successfully created a post'})
            history.push(`/post/${response.data}`)
            console.log('New post successfully created ')
        } catch (err) {
            console.log('there was a problem')
        }

    }

    return (
        <Page title="Create New Post">
            <form>
                <div className="form-group">
                    <label
                        htmlFor="post-title"
                        className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        autoComplete="off"/>
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        onChange={e => setBody(e.target.value)}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"/>
                </div>

                <button
                    onClick={handleSubmit}
                    className="btn btn-primary">Save New Post
                </button>
            </form>
        </Page>
    );
}

export default CreatePost;