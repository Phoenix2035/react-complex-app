import React, {useEffect, useContext} from 'react'
import {useImmerReducer} from "use-immer"
import Page from "./Page"
import Axios from "axios"
import {useParams, useHistory, Link} from 'react-router-dom'
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../Context/StateContext"
import DispatchContext from "../Context/DispatchContext"
import NotFound from "./NotFound";


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
        saveCount: 0,
        notFound: false
    }

    const ourReducer = (draft, action) => {
        switch (action.type) {
            case 'fetchComplete':
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.isFetching = false
                return
            case 'titleChange':
                draft.title.hasError = false
                draft.title.value = action.value
                return
            case 'bodyChange':
                draft.body.hasError = false
                draft.body.value = action.value
                return
            case 'submitRequest':
                if (!draft.title.hasError && !draft.body.hasError) {
                    draft.saveCount++
                }
                return
            case 'saveRequestStart':
                draft.isSaving = true
                return
            case 'saveRequestFinish':
                draft.isSaving = false
                return
            case 'titleRules':
                if (!action.value.trim()) {
                    draft.title.hasError = true
                    draft.title.errorMessage = 'provide a title.'
                }
                return
            case 'bodyRules':
                if (!action.value.trim()) {
                    draft.body.hasError = true
                    draft.body.errorMessage = 'please write something in body.'
                }
                return
            case 'notFound':
                draft.notFound = true
                return
        }
    }


    const [state, dispatch] = useImmerReducer(ourReducer, originalState)

    const submitHandler = e => {
        e.preventDefault()
        dispatch({type: 'titleRules', value: state.title.value})
        dispatch({type: 'bodyRules', value: state.body.value})
        dispatch({type: 'submitRequest'})
    }

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, {cancelToken: ourRequest.token})
                if (response.data) {
                    dispatch({type: 'fetchComplete', value: response.data})
                    if (appState.user.username !== response.data.author.username) {
                        appDispatch({type: 'flashMessage', value: 'You do not permission to edit that post.'})
                        history.push('/')
                    }
                } else {
                    dispatch({type: 'notFound'})
                }

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
                    await Axios.post(`/post/${state.id}/edit`, {
                        title: state.title.value,
                        body: state.body.value,
                        token: appState.user.token
                    }, {cancelToken: ourRequest.token})
                    dispatch({type: 'saveRequestFinish'})
                    appDispatch({type: 'flashMessage', value: 'Post was updated.'})
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


    if (state.notFound) {
        return (
            <NotFound/>
        )
    }

    if (state.isFetching) return <Page title="...">
        <LoadingDotsIcon/>
    </Page>


    return (
        <Page title="Create New Post">
            <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo; Back to Post Permalink</Link>
            <form className="mt-4" onSubmit={submitHandler}>
                <div className="form-group">
                    <label
                        htmlFor="post-title"
                        className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        onBlur={e => dispatch({type: 'titleRules', value: e.target.value})}
                        onChange={e => dispatch({type: 'titleChange', value: e.target.value})}
                        value={state.title.value}
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        autoComplete="off"/>
                    {state.title.hasError &&
                    <div className="alert alert-danger small liveValidateMessage">
                        {state.title.errorMessage}
                    </div>
                    }
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea
                        onBlur={e => dispatch({type: 'bodyRules', value: e.target.value})}
                        onChange={e => dispatch({type: 'bodyChange', value: e.target.value})}
                        value={state.body.value}
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"/>
                    {state.body.hasError &&
                    <div className="alert alert-danger small liveValidateMessage">
                        {state.body.errorMessage}
                    </div>
                    }
                </div>

                <button className="btn btn-primary"
                        disabled={state.isSaving || state.title.hasError || state.body.hasError}>
                    {state.isSaving ? 'Saving ...' : 'Save Updates'}
                </button>
            </form>
        </Page>
    );
}

export default EditPost;