import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styled from '../assets/styles/Register.module.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { registerUser } from '../utils/Api';
const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    const handleBackLogin = () => {
        navigate('/login')
    }

    const signUp = async () => {
        // Validate username, email, password
        const validationErrors = {};

        if (!username.trim()) {
            validationErrors.username = "Vui lòng nhập tên đăng nhập";
        }

        if (!email.trim()) {
            validationErrors.email = "Vui lòng nhập email";
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                validationErrors.email = "Định dạng email không hợp lệ";
            }
        }

        if (!password.trim()) {
            validationErrors.password = "Vui lòng nhập mật khẩu";
        } else if (password.length < 8) {
            validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        const usernamePattern = /^[a-zA-Z0-9]+$/;
        if (!usernamePattern.test(username)) {
            validationErrors.username = "Tên đăng nhập không hợp lệ, không sử dụng kí tự đặc biệt";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await registerUser(username, email, password);
            console.log("Kết quả đăng ký:", response);
            localStorage.setItem("user-info", JSON.stringify(response));
            setIsRegistered(true);
            notify()
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
                setTimeout(() => {
                    setErrors({});
                }, 3000);
            }
        }
    };

    const handleSignUp = async () => {
        signUp();
    };

    const notify = () => {
        if (!isRegistered) {
            toast("Đăng kí thành công !!!");
        }
    };

    return (
        <Container className={styled.Container}>
            <Form className={styled.FormLogin}>
                <div className={styled.LoginWith}>
                    <div className={styled.InforLogin}>
                        <h3>Đăng Ký Tài Khoản</h3>
                    </div>
                    <div>
                        <Form.Group className="mb-3" controlId="formGroupUsername">
                            <Form.Label>Tên người dùng</Form.Label>
                            <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="text" placeholder="Nhập tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} />
                            {errors.username && <p className={styled.error} style={{ color: 'red' }}>{errors.username}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Địa chỉ email</Form.Label>
                            <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && <p className={styled.error} style={{ color: 'red' }}>{errors.email}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control style={{ borderRadius: '50px', padding: '15px' }} type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {errors.password && <p className={styled.error} style={{ color: 'red' }}>{errors.password}</p>}
                        </Form.Group>

                    </div>
                    <Button style={{ borderRadius: '50px', padding: '15px', marginTop: '20px' }} variant="outline-primary" onClick={handleSignUp}>Xác nhận</Button>
                    <div>
                        <p className={styled.textInfo}><span>Bạn Đã Có Tài Khoản?</span><button className={styled.BtnDangKy} onClick={handleBackLogin}>Đăng nhập</button></p>
                    </div>
                </div>
            </Form>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Container>
    );
};

export default Register;