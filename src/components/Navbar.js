import React, { useState, useEffect } from "react";
import styled from "../assets/styles/Navbar.module.css";
import { BiLogOut, BiArrowBack } from "react-icons/bi";
import { AiOutlineUser, AiOutlineEdit } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Navbar = ({ isProfile = false }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [dropdownShow, setDropdownShow] = useState(false);
    const navigate = useNavigate();
    const changeStatus = () => {
        navigate("/login");
    };
    const changeStatusRegister = () => {
        navigate("/register");
    };
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
            setUsername(parsedUserInfo.username);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className={styled.BoxNavbar}>
            <div className={`${styled.Navbar} ${isProfile && styled.ProfileNab}`}>
                <div className={styled.Logo}>
                    {!isProfile ? (
                        <Link
                            to={"/"}
                        >
                            group1
                        </Link>
                    ) : (
                        <Link to={"/"}>
                            <BiArrowBack />
                        </Link>
                    )}
                </div>
                <div className={styled.Nav}>
                    <ul>
                        {isLoggedIn ? (
                            <>
                                {[""].map((variant) => (
                                    <DropdownButton
                                        as={ButtonGroup}
                                        title={`Hi, ${username}`}
                                        id={`dropdown-variants-${variant}`}
                                        variant={variant.toLowerCase()}
                                        show={dropdownShow}
                                        onMouseEnter={() => setDropdownShow(true)}
                                        onMouseLeave={() => setDropdownShow(false)}
                                        className={`${styled.CustomDropdownButton} custom-dropdown`}
                                    >
                                        <Dropdown.Item eventKey="1">
                                            <AiOutlineUser className="mx-2 mb-1" />{" "}
                                            <Link
                                                to={"/yourprofile"}
                                                style={{ textDecoration: "none", color: "black" }}
                                            >
                                                Profile
                                            </Link>{" "}
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="1">
                                            <AiOutlineEdit className="mx-2 mb-1" />{" "}
                                            <Link
                                                to={"/edit"}
                                                style={{ textDecoration: "none", color: "black" }}
                                            >
                                                New Article
                                            </Link>{" "}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout} eventKey="2">
                                            <BiLogOut className="mx-2 mb-1" />
                                            Logout
                                        </Dropdown.Item>
                                    </DropdownButton>
                                ))}
                            </>
                        ) : (
                            <li>
                                <button onClick={changeStatus}>Login</button>
                                <button onClick={changeStatusRegister}>Register</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="container-fluid"></div>
        </div>
    );
};

export default Navbar;