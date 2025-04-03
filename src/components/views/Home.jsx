import '../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col } from 'react-bootstrap';
import { ReactComponent as ScoreIconR } from '../assets/score1.svg';
import { ReactComponent as ScoreIconL } from '../assets/score2.svg';
import { ReactComponent as LineH } from '../assets/Line 2.svg';


export default function Home() {
    return (
        <div>
            <Row className='d-flex justify-content-between'>
                <Col>
                    <ScoreIconL />
                </Col>
                <Col className='d-flex justify-content-end'>
                    <ScoreIconR />
                </Col>
            </Row>
            <Row>
                <div className="line-h"></div>
            </Row>
            <Container fluid='lg'>
                <Row className='d-flex justify-content-between'>
                    <Col>
                        123
                    </Col>
                    <Col>
                        123
                    </Col>
                    <Col>
                        123
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
