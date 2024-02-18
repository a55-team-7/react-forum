
import { useContext, useState } from 'react'
import Container from '../Container/Container'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'
import AppContext from '../../context/AppContext'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function Home() {
    const { user, userData } = useContext(AppContext);
    const [view, setView] = useState('home');
    const location = useLocation();

    let userPageLink = '/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    return (
        <>
            {user ?
                <div>
                    <div id="home-layout-grid-authenticated">

                        <div id='sidebar-content'>
                            <Container>

                                {(location.pathname !== '/home/my-posts' && location.pathname !== '/home') && <NavLink to="my-posts" activeClassName="active">My Feed</NavLink>}
                                <NavLink to="recents" activeClassName="active">Recents</NavLink>
                                <NavLink to="popular" activeClassName="active">Popular</NavLink>
                                {userData && !userData.isBlocked && <NavLink to="create-post" activeClassName="active">Create Post</NavLink>}
                                {userData && userData.isAdmin && <NavLink to="users" activeClassName="active">Users</NavLink>}
                                <NavLink to={userPageLink} activeClassName="active" >User Page</NavLink>

                            </Container>
                        </div>

                        <div id='main-content'>
                            <Container>

                                <Outlet />

                            </Container>
                        </div>

                    </div>
                </div>
                :
                <div>
                    <div id='currentUsers-and-Post-content'>
                        <Container>

                            <h2 id='number-of-users'>Current users: <br /> 20,109</h2>
                            <h2 id='number-of-posts'>Posts:<br /> 40,290</h2>

                        </Container>
                    </div>
                    <div id='recents-and-popular-content'>

                        <Container>
                            <button onClick={() => setView('recents')}>Recents</button>
                            <button onClick={() => setView('popular')}>Popular</button>
                            {view === 'recents' && <Recents />}
                            {view === 'popular' && <Popular />}


                        </Container>
                    </div>
                </div>
            }

        </>
    )
}