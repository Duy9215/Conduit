import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styles from '../assets/styles/Login.module.css';
import { AiOutlineUser } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';

const Login = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await loginUser(credentials.email, credentials.password);

            if (response) {
                localStorage.setItem('user-info', JSON.stringify(response.user));
                navigate('/');
            } else {
                throw new Error('Invalid login response');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };

    const renderLoginForm = () => (
        <>
            <Header />
            <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Control
                    style={{ borderRadius: '50px', padding: '15px' }}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Control
                    style={{ borderRadius: '50px', padding: '15px' }}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Button className="mt-2" variant="outline-primary" onClick={handleLogin}>
                Login
            </Button>
            <button
                style={{ fontSize: '15px', marginTop: '10px', padding: '10px 15px' }}
                onClick={() => setShowLogin(false)}
            >
                <BiArrowBack />
            </button>
        </>
    );

    const renderInitialOptions = () => (
        <>
            <button
                className={`${styles.UserICon}`}
                onClick={() => setShowLogin(true)}
            >
                <AiOutlineUser /> <span>Sử dụng email/số điện thoại</span>
            </button>
            <p className={styles.textInfo}>
                <span>Bạn Chưa Có Tài Khoản?</span>
                <button
                    className={styles.BtnDangKy}
                    onClick={() => navigate('/register')}
                >
                    Đăng ký
                </button>
            </p>
        </>
    );

    return (
        <Container className={styles.Container}>
            <Form className={styles.FormLogin}>
                {!showLogin && (
                    <BiArrowBack
                        className={styles.IconBack}
                        onClick={() => navigate('/')}
                    />
                )}
                <div className={styles.LoginWith}>
                    <div className={styles.InforLogin}>
                        <div className={styles.logo}>GR1</div>
                        <h2>Đăng Nhập Vào GR1</h2>
                    </div>
                    {showLogin ? renderLoginForm() : renderInitialOptions()}
                </div>
            </Form>
            <ToastContainer />
        </Container>
    );
};

export default Login;
