
import Container from '../Container/Container'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'

export default function Home() {
    return (
        <>
            <div id='currentUsers-and-Post-content'>
                <Container>
                <h2 id='number-of-users'>Current users: <br/> 20,109</h2>
                <h2 id='number-of-posts'>Posts:<br/> 40,290</h2>
                </Container>
            </div>
            <div id='recents-and-popular-content'>
                <Container>
                     <Recents /> 
                    <Popular /> 
                </Container>
            </div>

        </>
    )
}