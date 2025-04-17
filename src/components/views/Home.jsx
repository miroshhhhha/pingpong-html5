import '../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function Home() {
    return (
        <div className="container-lg d-flex justify-content-center">
            <div className="home d-flex align-items-center">
                <h1>Press <span>SPACE</span> to start the game</h1>
            </div>
        </div>
    );
}

export default Home;
