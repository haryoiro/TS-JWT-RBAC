import * as React from "react"
import { Route, Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authSelectors } from '../state/auth.state';

export { PrivateRoute };

function PrivateRoute({ component: Component, ...rest }: any) {
    const loggedIn = authSelectors.loggedIn()
    return (
        <Route {...rest} render={props => {
            if (!loggedIn) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            // authorized so return component
            return <Component {...props} />
        }} />
    );
}