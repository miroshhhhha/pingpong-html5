import { useState, useEffect, useRef } from 'react';
import '../styles/style.css';
import '../styles/game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { ReactComponent as ScoreIconR } from '../assets/score1.svg';
import { ReactComponent as ScoreIconL } from '../assets/score2.svg';
import { ReactComponent as PadelR } from '../assets/padel1.svg';
import { ReactComponent as PadelL } from '../assets/padel2.svg';
import bounceSound from '../assets/bounce.mp3';
const audioBounce = new Audio('/bounce.mp3');

export default function Game() {
    const [score, setScore] = useState({ left: 0, right: 0 });
    const [time, setTime] = useState(0);
    const [leftPaddleY, setLeftPaddleY] = useState(50);
    const [rightPaddleY, setRightPaddleY] = useState(50);
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
    const ballDirection = useRef({ x: 1, y: 1 });
    const keysPressed = useRef({});

    const ballSpeed = 0.5;
    const paddleSpeed = 1.5;

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
                setLeftPaddleY(prev => Math.max(prev - paddleSpeed, 23));
            }
            if (keysPressed.current['s'] || keysPressed.current['S']) {
                setLeftPaddleY(prev => Math.min(prev + paddleSpeed, 90));
            }

            if (keysPressed.current['ArrowUp']) {
                setRightPaddleY(prev => Math.max(prev - paddleSpeed, 23));
            }
            if (keysPressed.current['ArrowDown']) {
                setRightPaddleY(prev => Math.min(prev + paddleSpeed, 90));
            }

            requestAnimationFrame(movePaddles);
        };

        movePaddles();
    }, []);

    // Ball movement logic
    useEffect(() => {
        const resetBall = (direction = 1) => {
            ballDirection.current = { x: direction, y: Math.random() * 2 - 1 };
            setBallPosition({ x: 50, y: 50 });
        };

        const updateScore = (side) => {
            setScore(prev => ({
                ...prev,
                [side]: prev[side] + 1,
            }));
        };

        const moveBall = () => {
            let { x, y } = ballPosition;
            let { x: dx, y: dy } = ballDirection.current;

            x += dx * ballSpeed;
            y += dy * ballSpeed;

            if (y <= 10 || y >= 95) {
                dy *= -1;
            }

            if (x <= 0) {
                updateScore('right');
                resetBall(1); // right
                return;
            }

            if (x >= 100) {
                updateScore('left');
                resetBall(-1); //  left
                return;
            }

            // left paddle
            if (x <= 5 && y >= leftPaddleY - 10 && y <= leftPaddleY + 10) {
                dx *= -1;
                audioBounce.play();
            }

            // right paddle
            if (x >= 95 && y >= rightPaddleY - 10 && y <= rightPaddleY + 10) {
                dx *= -1;
                audioBounce.play();
            }



            ballDirection.current = { x: dx, y: dy };
            setBallPosition({ x, y });

            requestAnimationFrame(moveBall);
        };

        requestAnimationFrame(moveBall);
    }, [leftPaddleY, rightPaddleY, ballPosition]);

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

            <div className="ball" style={{ top: `${ballPosition.y}%`, left: `${ballPosition.x}%` }} />

            <PadelL className="paddle paddle-l" style={{ top: `${leftPaddleY}%` }} />
            <PadelR className="paddle paddle-r" style={{ top: `${rightPaddleY}%` }} />
        </div>
    );
}
