
import { useContext, useState } from 'react'
import Container from '../Container/Container'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'
import AppContext from '../../context/AppContext'
import { Link, Outlet } from 'react-router-dom'

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
                                <Link to="recents">Recents</Link>
                                <Link to="popular">Popular</Link>
                                <Link to="my-posts">My Posts</Link>
                                <Link to="create-post">Create Post</Link>
                                <Link to="settings">Settings</Link>
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