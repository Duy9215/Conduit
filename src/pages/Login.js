import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styled from '../assets/styles/Login.module.css';
import { BsFacebook, BsGoogle, BsGithub } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showHome, setShowHome] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    const handleShowLogin = () => {
        setShowLogin(true);
    };

    const handleBackLogin = () => {
        setShowLogin(false);
    };

    const handleBackHome = () => {
        setShowHome(false);
        navigate('/');
    };

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
            toast.error('Đăng nhập thất bại rồi bro!', {
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
        <Container className={styled.Container}>
            <Form className={styled.FormLogin}>
                {!showLogin ? (
                    <BiArrowBack className={styled.IconBack} onClick={handleBackHome} />
                ) : (
                    <>
                    </>
                )}

                <div className={styled.LoginWith}>
                    {!showLogin ? (
                        <>
                            <div className={styled.InforLogin}>
                                <div className={styled.logo}>
                                    G1FA
                                </div>
                            </div>
                            <button className={`${styled.UserICon} ${styled.AllButton}`} onClick={handleShowLogin}><AiOutlineUser /> <span>Sử dụng email/số điện thoại</span> <div></div></button>
                            <button className={`${styled.FaceBook} ${styled.AllButton}`}><BsFacebook /> <span>Tiếp Tục Với FaceBook</span> <div></div></button>
                            <button className={`${styled.Google} ${styled.AllButton}`}><BsGoogle /> <span>Tiếp Tục Với Google</span> <div></div></button>
                            <button className={`${styled.Github} ${styled.AllButton}`}><BsGithub /> <span>Tiếp Tục Với Github</span> <div></div></button>
                            <p className={styled.textInfo}>
                                <span>Bạn Chưa Có Tài Khoản?</span>
                                <button className={styled.BtnDangKy} onClick={handleRegisterClick}>Đăng kí</button>
                            </p>
                        </>
                    ) : (
                        <>   <h3 style={{ marginTop: '50px', textAlign: 'center', paddingBottom: '30px', color: '#0d6efd' }}>Đăng nhập</h3>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label>Địa chỉ email</Form.Label>
                                <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="email" placeholder="nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupPassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="password" placeholder="mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button className='mt-2' variant="outline-primary" onClick={handleLogin}>Xác nhận</Button>
                            <div>
                                <button style={{ fontSize: '20px', padding: '10px 15px' }} onClick={handleBackLogin}><BiArrowBack /></button>
                            </div>
                        </>
                    )}
                </div>
            </Form>
            <ToastContainer />
        </Container>
    );
};

export default Login;
