import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Alert } from 'antd';

const { Title, Text } = Typography;

const GuessNumber: React.FC = () => {
    const [secretNumber, setSecretNumber] = useState(0);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'info' | 'warning' | 'error'>('info');
    const [gameOver, setGameOver] = useState(false);

    const initGame = () => {
        const random = Math.floor(Math.random() * 100) + 1;
        setSecretNumber(random);
        setGuess('');
        setAttempts(0);
        setMessage('Hãy đoán một số từ 1 đến 100. Bạn có 10 lượt!');
        setMessageType('info');
        setGameOver(false);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleGuess = () => {
        const guessNumber = parseInt(guess);

        if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
            setMessage('Vui lòng nhập số từ 1 đến 100!');
            setMessageType('error');
            return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (guessNumber === secretNumber) {
            setMessage(`🎉 Chúc mừng! Bạn đã đoán đúng sau ${newAttempts} lượt!`);
            setMessageType('success');
            setGameOver(true);
        } else if (newAttempts >= 10) {
            setMessage(`😢 Bạn đã hết lượt! Số đúng là ${secretNumber}`);
            setMessageType('error');
            setGameOver(true);
        } else if (guessNumber < secretNumber) {
            setMessage('📈 Bạn đoán quá thấp! Hãy thử số lớn hơn.');
            setMessageType('warning');
        } else {
            setMessage('📉 Bạn đoán quá cao! Hãy thử số nhỏ hơn.');
            setMessageType('warning');
        }

        setGuess('');
    };

    return (
        <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={2}>🎮 Game Đoán Số</Title>

                    <Alert message={message} type={messageType} showIcon />

                    <div>
                        <Text strong>Số lượt đã dùng: {attempts}/10</Text>
                    </div>

                    <Space style={{ width: '100%', gap: 0 }}>
                        <Input
                            type="number"
                            placeholder="Nhập số từ 1-100"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            onPressEnter={handleGuess}
                            disabled={gameOver}
                            size="large"
                        />
                        <Button
                            type="primary"
                            onClick={handleGuess}
                            disabled={gameOver}
                            size="large"
                        >
                            Đoán
                        </Button>
                    </Space>

                    {gameOver && (
                        <Button type="primary" onClick={initGame} block size="large">
                            🔄 Chơi lại
                        </Button>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default GuessNumber;