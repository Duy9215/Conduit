import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import styles from "../assets/styles/Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/Api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser(credentials.email, credentials.password);

      if (response) {
        localStorage.setItem("user-info", JSON.stringify(response.user));
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Đăng nhập không thành công! Vui lòng thử lại.");
    }
  };

  const renderLoginForm = () => (
    <>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange}
          className="form-control"
        />
      </Form.Group>
      <Button className={styles.BtnLogin} onClick={handleLogin}>
        Login
      </Button>
      {errorMessage && <div className={styles.ErrorMessage}>{errorMessage}</div>}
    </>
  );

  return (
    <>
      <Header />
      <Container className={styles.Container}>
        <Form className={styles.FormLogin}>
          <div className={styles.LoginWith}>
            <div className={styles.InforLogin}>
              <h2>Sign in</h2>
              <Link className={styles.BtnDangKy} to="/register">Need an account?</Link>
            </div>
            {renderLoginForm()}
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
