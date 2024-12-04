import React, { useState, useEffect } from "react";
import styled from "../assets/styles/Navbar.module.css";
import { Nav } from "react-bootstrap";
import { BiLogOut, BiArrowBack } from "react-icons/bi";
import { AiOutlineUser, AiOutlineEdit } from "react-icons/ai";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Navbar = ({ isProfile = false }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [dropdownShow, setDropdownShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user-info");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/");
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("user-info");
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            if (parsedUserInfo.username) {
                setUsername(parsedUserInfo.username);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className={styled.BoxNavbar}>
            <div className={`${styled.Navbar} ${isProfile && styled.ProfileNab}`}>
                <div className={styled.Logo}>
                    {!isProfile ? (
                        <Link to={"/"}>group1</Link>
                    ) : (
                        <Link to={"/"}>
                            <BiArrowBack />
                        </Link>
                    )}
                </div>
                <div className={styled.Nav}>
                    <ul>
                        {isLoggedIn ? (
                            <div className="d-flex">
                                <Nav>
                                    <Nav.Link
                                        as={Link}
                                        to="/"
                                        className={`${styled.NavLink} ${location.pathname === "/" ? styled.Active : ""
                                            }`}
                                    >
                                        Home
                                    </Nav.Link>
                                </Nav>
                                {[""].map((variant) => (
                                    <DropdownButton
                                        as={ButtonGroup}
                                        title={`Xin chào, ${username}`}
                                        id="dropdown-variants"
                                        show={dropdownShow}
                                        onClick={() => setDropdownShow(!dropdownShow)}
                                        className="me-3"
                                    >
                                        <Dropdown.Item eventKey="1" className="DropdownMenu">
                                            <AiOutlineUser className="mx-2 mb-1" />
                                            <Link
                                                to="/yourprofile"
                                                style={{ textDecoration: "none", color: "black" }}
                                            >
                                                Profile
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="1" className="DropdownMenu">
                                            <AiOutlineEdit className="mx-2 mb-1" />
                                            <Link
                                                to="/add"
                                                style={{ textDecoration: "none", color: "black" }}
                                            >
                                                New Article
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item
                                            onClick={handleLogout}
                                            eventKey="2"
                                            className="DropdownMenu"
                                        >
                                            <BiLogOut className="mx-2 mb-1" />
                                            <span>Logout</span>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                ))}
                            </div>
                        ) : (
                            <li>
                                <Nav>
                                    <Nav.Link
                                        as={Link}
                                        to="/"
                                        className={`${styled.NavLink} ${location.pathname === "/" ? styled.Active : ""
                                            }`}
                                    >
                                        Home
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/login"
                                        className={`${styled.NavLink} ${location.pathname === "/login" ? styled.Active : ""
                                            }`}
                                    >
                                        Login
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/register"
                                        className={`${styled.NavLink} ${location.pathname === "/register" ? styled.Active : ""
                                            }`}
                                    >
                                        Register
                                    </Nav.Link>
                                </Nav>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;