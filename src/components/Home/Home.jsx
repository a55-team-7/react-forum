
import { useContext, useState } from 'react'
import Container from '../Container/Container'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'
import AppContext from '../../context/AppContext'
import { Link, Outlet } from 'react-router-dom'
import AllPosts from '../AllPosts/AllPosts'

export default function Home() {
    const { user } = useContext(AppContext);
    const [view, setView] = useState('home');

    return (
        <>
            {user ?
                <div>
                    <div id="home-layout-grid-authenticated">
                        <div id='sidebar-content'>
                            <Container>

                                {(view !== 'home') && <Link to="my-posts">My Feed</Link>}
                                <div onClick={() => setView('recents')}>
                                    <Link to="recents">Recents</Link>
                                </div>
                                <div onClick={() => setView('popular')}>
                                    <Link to="popular">Popular</Link>
                                </div>
                                <div onClick={() => setView('create-post')}>
                                    <Link to="create-post">Create Post</Link>
                                </div>
                                <div onClick={() => setView('settings')}>
                                    <Link to="settings">Settings</Link>
                                </div>
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