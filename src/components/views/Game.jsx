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
    let [time, setTime] = useState(0);
    const [leftPaddleY, setLeftPaddleY] = useState(50);
    const [rightPaddleY, setRightPaddleY] = useState(50);
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 }); // Still keep this for rendering
    const ballPositionRef = useRef({ x: 50, y: 50 });
    const ballDirectionRef = useRef({ x: 1, y: 1 });
    const keysPressed = useRef({});
    const ballSpeed = 0.5;
    
    // Use refs to store paddle positions for better access in the animation loop
    const leftPaddleYRef = useRef(leftPaddleY);
    const rightPaddleYRef = useRef(rightPaddleY);
    
    useEffect(() => {
        leftPaddleYRef.current = leftPaddleY;
        rightPaddleYRef.current = rightPaddleY;
    }, [leftPaddleY, rightPaddleY]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Ball movement logic
    useEffect(() => {
        const resetBall = (direction = 1) => {
            const newDirection = {
                x: direction, // 1 = right, -1 = left
                y: parseFloat((Math.random() * 1 - 0.5).toFixed(2)), // Random vertical
            };
            ballPositionRef.current = { x: 50, y: 50 };
            ballDirectionRef.current = newDirection;
            setBallPosition({ x: 50, y: 50 });
        };

        const updateScore = (side) => {
            setScore(prev => ({
                ...prev,
                [side]: prev[side] + 1,
            }));
        };

        const moveBall = () => {
            let { x, y } = ballPositionRef.current;
            let { x: dx, y: dy } = ballDirectionRef.current;

            // Update ball position
            x += dx * ballSpeed;
            y += dy * ballSpeed;

            // Bounce off top/bottom walls
            if (y <= 11 || y >= 96) {
                dy *= -1;
            }

            // Ball hits left wall (score for right player)
            if (x <= 0) {
                updateScore('right');
                setTimeout(() => {
                    resetBall(1); // go right
                    requestAnimationFrame(moveBall);
                }, 500);
                return;
            }

            // Ball hits right wall (score for left player)
            if (x >= 100) {
                updateScore('left');
                setTimeout(() => {
                    resetBall(-1); // go left
                    requestAnimationFrame(moveBall);
                }, 500);
                return;
            }

            // Ball hits the right paddle
            if (x >= 95 && x <= 100 && y >= rightPaddleYRef.current - 10 && y <= rightPaddleYRef.current + 10) {
                // Ball hits the right paddle
                console.log("Ball hit the right paddle!");
                console.log(dx)
                dx *= -1; // Reverse ball's horizontal direction upon paddle hit
            }

            // Save updates
            ballDirectionRef.current = { x: dx, y: dy };
            ballPositionRef.current = { x, y };
            setBallPosition({ x, y });

            // Continue animation
            requestAnimationFrame(moveBall);
        };

        const animationId = requestAnimationFrame(moveBall);
        return () => cancelAnimationFrame(animationId);
    }, [rightPaddleY, leftPaddleY]); // Dependency on paddle positions

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
                setLeftPaddleY(prev => {
                    const newY = prev - 1.5;
                    if (newY < 23) return prev;
                    return newY;
                });
            }
            if (keysPressed.current['s'] || keysPressed.current['S']) {
                setLeftPaddleY(prev => {
                    const newY = prev + 1.5;
                    if (newY > 90) return prev;
                    return newY;
                });
            }
            if (keysPressed.current['ArrowUp']) {
                setRightPaddleY(prev => {
                    const newY = prev - 1.5;
                    if (newY < 23) return prev;
                    return newY;
                });
            }
            if (keysPressed.current['ArrowDown']) {
                setRightPaddleY(prev => {
                    const newY = prev + 1.5;
                    if (newY > 90) return prev;
                    return newY;
                });
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
