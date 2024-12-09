import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styled from '../assets/styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();


    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            console.log("Kết quả đăng nhập:", response);

            if (response) {
                localStorage.setItem("user-info", JSON.stringify(response.user));
                navigate("/");
            } else {
                console.error("Lỗi đăng nhập:", response);
                setLoginError(true);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setLoginError(true);
            toast.error('Đăng nhập thất bại!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        }
    };


    return (
        <div>
            <Header />
            <Container className={styled.Container}>
                <Form className={styled.FormLogin}>
                    <div className={styled.LoginWith}>
                        <h3 style={{ marginTop: '50px', textAlign: 'center', paddingBottom: '30px', color: '#0d6efd' }}>Đăng nhập</h3>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Địa chỉ email</Form.Label>
                            <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="email" placeholder="nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="password" placeholder="mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button className='mt-2' variant="outline-primary" onClick={handleLogin} style={{ border: '1px solid', borderRadius: '50px' }} >Xác nhận</Button>
                        <p className={styled.textInfo}>
                            <span>Bạn Chưa Có Tài Khoản?</span>
                            <button className={styled.BtnDangKy} onClick={handleRegisterClick}>Đăng kí</button>
                        </p>
                    </div>
                </Form>
                <ToastContainer />
            </Container>
            <Footer />
        </div>
    );
};

export default Login;