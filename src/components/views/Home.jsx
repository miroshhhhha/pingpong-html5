// import '../styles/style.css';
// import 'bootstrap/dist/css/bootstrap.min.css';



// function Home() {
//     return (
//         <div className="container-lg d-flex justify-content-center">
//             <div className="home d-flex align-items-center">
//                 <h1>Press <span>SPACE</span> or <span>LMB</span> to start the game</h1>
//             </div>
//         </div>
//     );
// }

// export default Home;

import '../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    return (
        <div className="container-lg d-flex flex-column align-items-center justify-content-center text-center home">
            <h1 className="mb-5">
                Press <span>SPACE</span> or <span>LMB</span> to start the game
            </h1>

            <div className="instructions bg-light p-4 rounded shadow-sm text-dark">
                <h4 className="mb-3">📘 Controls:</h4>
                <ul className="list-unstyled">
                    <li><strong>W</strong> / <strong>S</strong> — move left paddle up / down</li>
                    <li><strong>↑</strong> / <strong>↓</strong> — move right paddle up / down</li>
                    <li><strong>P</strong> — pause / resume the game</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
