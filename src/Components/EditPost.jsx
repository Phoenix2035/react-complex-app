import React, {useEffect, useContext} from 'react'
import {useImmerReducer} from "use-immer"
import Page from "./Page"
import Axios from "axios"
import {Link, useParams, useHistory} from 'react-router-dom'
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../Context/StateContext"
import DispatchContext from "../Context/DispatchContext"


function EditPost() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const history = useHistory()

    const originalState = {
        title: {
            value: '',
            hasError: false,
            errorMessage: ''
        },
        body: {
            value: '',
            hasError: false,
            errorMessage: ''
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        saveCount: 0
    }

    const ourReducer = (draft, action) => {
        switch (action.type) {
            case 'fetchComplete':
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.isFetching = false
                return
            case 'titleChange':
                draft.title.value = action.value
                return
            case 'bodyChange':
                draft.body.value = action.value
                return
            case 'submitRequest':
                draft.saveCount++
                return
            case 'saveRequestStart':
                draft.isSaving = true
                return
            case 'saveRequestFinish':
                draft.isSaving = false
                return
        }
    }


    const [state, dispatch] = useImmerReducer(ourReducer, originalState)

    const submitHandler = e => {
        e.preventDefault()
        dispatch({type: 'submitRequest'})
    }

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {cancelToken: ourRequest.token})
                dispatch({type: 'fetchComplete', value: response.data})
            } catch (err) {
                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchPost()

        return () => {
            ourRequest.cancel()
        }
    }, [])


    useEffect(() => {
        if (state.saveCount) {
            dispatch({type: 'saveRequestStart'})
            const ourRequest = Axios.CancelToken.source()


            async function fetchPost() {
                try {
                    const response = await Axios.post(`/post/${state.id}/edit`, {
                        title: state.title.value,
                        body: state.body.value,
                        token: appState.user.token
                    }, {cancelToken: ourRequest.token})
                    dispatch({type: 'saveRequestFinish'})
                    appDispatch({type: 'flashMessages', value: 'post was updated.'})
                    history.push(`/post/${state.id}`)
                } catch (err) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }

            fetchPost()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.saveCount])


    if (state.isFetching) return <Page title="...">
        <LoadingDotsIcon/>
    </Page>


    return (
        <Page title="Create New Post">
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label
                        htmlFor="post-title"
                        className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        onChange={e => dispatch({type: 'titleChange', value: e.target.value})}
                        value={state.title.value}
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
                        onChange={e => dispatch({type: 'bodyChange', value: e.target.value})}
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"/>
                </div>

                <button className="btn btn-primary"
                        disabled={state.isSaving}>{state.isSaving ? 'Saving ...' : 'Save Updates'}</button>
            </form>
        </Page>
    );
}

export default EditPost;