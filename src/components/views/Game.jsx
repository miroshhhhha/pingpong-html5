import { useState, useEffect, useRef } from 'react';
import '../styles/style.css';
import '../styles/game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
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
    const [isPaused, setIsPaused] = useState(false);
    const [unpauseGrace, setUnpauseGrace] = useState(false);
    const ballDirection = useRef({ x: 1, y: 1 });
    const keysPressed = useRef({});
    const lastFrameTime = useRef(performance.now());
    const savedDirection = useRef({ x: 1, y: 1 });
    const savedPosition = useRef({ x: 1, y: 1 });

    const ballSpeed = 0.7;
    const paddleSpeed = 1.5;
    const gracePeriod = 1000;

    useEffect(() => {
        let intervalId;
        if (!isPaused) {
            intervalId = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isPaused]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current[e.key] = true;
            if (e.key === 'p' || e.key === 'P') {
                setIsPaused(prev => {
                    if (!prev) {
                        savedDirection.current = { ...ballDirection.current };
                        savedPosition.current = { ...ballPosition.current };
                    } else {
                        ballDirection.current = { ...savedDirection.current };
                        setUnpauseGrace(true);
                        setTimeout(() => setUnpauseGrace(false), gracePeriod);
                    }
                    return !prev;
                });
            }
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
        let animationFrameId;

        const resetBall = (direction = 1) => {
            ballDirection.current = { x: direction, y: Math.random() * 2 - 1 };
            savedDirection.current = { ...ballDirection.current };
            setBallPosition({ x: 50, y: 50 });
        };

        const updateScore = (side) => {
            setScore(prev => ({
                ...prev,
                [side]: prev[side] + 1,
            }));
        };

        const gameLoop = (currentTime) => {
            const deltaTime = Math.min((currentTime - lastFrameTime.current) / 16.67, 2);
            lastFrameTime.current = currentTime;

            if (isPaused) {
                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            setLeftPaddleY(prev => {
                let newY = prev;
                if (keysPressed.current['w'] || keysPressed.current['W']) {
                    newY = Math.max(prev - paddleSpeed * deltaTime, 23);
                }
                if (keysPressed.current['s'] || keysPressed.current['S']) {
                    newY = Math.min(prev + paddleSpeed * deltaTime, 90);
                }
                return newY;
            });

            setRightPaddleY(prev => {
                let newY = prev;
                if (keysPressed.current['ArrowUp']) {
                    newY = Math.max(prev - paddleSpeed * deltaTime, 23);
                }
                if (keysPressed.current['ArrowDown']) {
                    newY = Math.min(prev + paddleSpeed * deltaTime, 90);
                }
                return newY;
            });

            setBallPosition(prev => {
                let { x, y } = prev;
                let { x: dx, y: dy } = ballDirection.current;

                if (unpauseGrace) {
                    return { x, y };
                }

                x += dx * ballSpeed * deltaTime;
                y += dy * ballSpeed * deltaTime;

                if (y <= 10 || y >= 95) {
                    dy *= -1;
                }

                if (x <= 0) {
                    updateScore('right');
                    resetBall(1);
                    return { x: 50, y: 50 };
                }

                if (x >= 100) {
                    updateScore('left');
                    resetBall(-1);
                    return { x: 50, y: 50 };
                }

                if (x <= 5 && y >= leftPaddleY - 10 && y <= leftPaddleY + 10) {
                    dx *= -1;
                    dy += (y - leftPaddleY) / 10;
                }

                if (x >= 95 && y >= rightPaddleY - 10 && y <= rightPaddleY + 10) {
                    dx *= -1;
                    dy += (y - rightPaddleY) / 10;
                }

                let speed = Math.sqrt(dx * dx + dy * dy);
                if (speed === 0 || !isFinite(speed)) {
                    dx = 1;
                    dy = Math.random() * 2 - 1;
                    speed = Math.sqrt(dx * dx + dy * dy);
                }
                dx /= speed;
                dy /= speed;

                ballDirection.current = { x: dx, y: dy };
                savedDirection.current = { x: dx, y: dy };
                return { x, y };
            });

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [leftPaddleY, rightPaddleY, isPaused]);

    useEffect(() => {
        if (!unpauseGrace && !isPaused) {
            ballDirection.current = { ...savedDirection.current };
            setBallPosition(pos => ({
                x: pos.x + savedDirection.current.x * 0.01,
                y: pos.y + savedDirection.current.y * 0.01,
            }));
        }
    }, [unpauseGrace, isPaused]);

    function timeFormat(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    return (
        <div className="game-wrapper">
            <Row className='d-flex justify-content-between align-items-center'>
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
            <div className="pause-button-container">
                <button 
                    className="pause-button" 
                    onClick={() => {
                        setIsPaused(prev => {
                            if (!prev) {
                                savedDirection.current = { ...ballDirection.current };
                                savedPosition.current = { ...ballPosition.current };
                            } else {
                                ballDirection.current = { ...savedDirection.current };
                                setUnpauseGrace(true);
                                setTimeout(() => setUnpauseGrace(false), gracePeriod);
                            }
                            return !prev;
                        });
                    }}
                >
                    <span className={isPaused ? 'blink' : ''}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </span>
                </button>
            </div>

            <div className="lineH-background" />
            <div className="lineV-background"><div className="lineV" /></div>

            <div className="line3" style={{ top: '13%', left: '0%' }} />
            <div className="line3" style={{ top: '13%', left: '99.77%' }} />

            <div className="ball" style={{ top: `${ballPosition.y}%`, left: `${ballPosition.x}%` }} />

            <PadelL className="paddle paddle-l" style={{ top: `${leftPaddleY}%` }} />
            <PadelR className="paddle paddle-r" style={{ top: `${rightPaddleY}%` }} />
        </div>
    );
}
