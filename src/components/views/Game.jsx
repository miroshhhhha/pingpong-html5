import { useState, useEffect, useRef } from 'react';
import '../styles/style.css';
import '../styles/game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { ReactComponent as ScoreIconR } from '../assets/score1.svg';
import { ReactComponent as ScoreIconL } from '../assets/score2.svg';
import { ReactComponent as PadelR } from '../assets/padel1.svg';
import { ReactComponent as PadelL } from '../assets/padel2.svg';

export default function Game() {
    const [score, setScore] = useState({ left: 0, right: 0 });
    const [time, setTime] = useState(0);
    const [leftPaddleY, setLeftPaddleY] = useState(50);
    const [rightPaddleY, setRightPaddleY] = useState(50);
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
    const [ballDirection, setBallDirection] = useState({ x: 0.5, y: 0.5 });
    const keysPressed = useRef({});
    const ballSpeed = 0.5;

    // Ball movement logic
    useEffect(() => {
        const moveBall = () => {
            setBallPosition(prev => {
                let newX = prev.x + ballDirection.x * ballSpeed;
                let newY = prev.y + ballDirection.y * ballSpeed;

                // Ball bouncing off top and bottom walls
                if (newY <= 0 || newY >= 100) {
                    setBallDirection(prev => ({ ...prev, y: -prev.y }));
                }

                // Ball bouncing off left and right walls
                if (newX <= 0 || newX >= 100) {
                    setBallDirection(prev => ({ ...prev, x: -prev.x }));
                }

                // Ball bouncing off the left paddle
                if (newX <= 5 && newY >= leftPaddleY - 5 && newY <= leftPaddleY + 20) {
                    setBallDirection(prev => ({ ...prev, x: -prev.x }));
                    setScore(prev => ({ ...prev, left: prev.left + 1 }));
                }

                // Ball bouncing off the right paddle
                if (newX >= 95 && newY >= rightPaddleY - 5 && newY <= rightPaddleY + 20) {
                    setBallDirection(prev => ({ ...prev, x: -prev.x }));
                    setScore(prev => ({ ...prev, right: prev.right + 1 }));
                }

                return { x: newX, y: newY };
            });

            requestAnimationFrame(moveBall); // Continue moving the ball
        };

        moveBall();
    }, [ballDirection, leftPaddleY, rightPaddleY]);

    // Paddle movement logic
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current[e.key] = true;
        };

        const handleKeyUp = (e) => {
            keysPressed.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const movePaddles = () => {
            if (keysPressed.current['w'] || keysPressed.current['W']) {
                setLeftPaddleY(prev => Math.max(0, prev - 1.5));
            }
            if (keysPressed.current['s'] || keysPressed.current['S']) {
                setLeftPaddleY(prev => Math.min(100, prev + 1.5));
            }
            if (keysPressed.current['ArrowUp']) {
                setRightPaddleY(prev => Math.max(0, prev - 1.5));
            }
            if (keysPressed.current['ArrowDown']) {
                setRightPaddleY(prev => Math.min(100, prev + 1.5));
            }

            requestAnimationFrame(movePaddles);
        };

        movePaddles();
    }, []);

    // Time formatting function
    function timeFormat(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    return (
        <div className="game-wrapper">
            <Row className='d-flex justify-content-between'>
                <Col className='d-flex'>
                    <div className="text-wrapper">
                        <ScoreIconL />
                        <span className="score-text score-text-l">{score.left}</span>
                    </div>
                </Col>
                <Col className='d-flex justify-content-center'>
                    <div className="text-wrapper">
                        <span className="score-text">{timeFormat(time)}</span>
                    </div>
                </Col>
                <Col className='d-flex justify-content-end'>
                    <div className="text-wrapper">
                        <ScoreIconR />
                        <span className="score-text score-text-r">{score.right}</span>
                    </div>
                </Col>
            </Row>

            <div className="lineH-background" />
            <div className="lineV-background"><div className="lineV" /></div>

            {/* Ball */}
            <div className="ball" style={{ top: `${ballPosition.y}%`, left: `${ballPosition.x}%` }} />

            {/* Paddles */}
            <PadelL className="paddle paddle-l" style={{ top: `${leftPaddleY}%` }} />
            <PadelR className="paddle paddle-r" style={{ top: `${rightPaddleY}%` }} />
        </div>
    );
}
