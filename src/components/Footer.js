import React from "react";
import styled from "../assets/styles/Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styled.PageContainer}>
      <div className={styled.BoxFooter}>
        <Link to="/" className={styled.FLOGO}>
          GR1
        </Link>
        <span className={styled.FText}>
          An interactive learning project from{" "}
          <a className={styled.FLink} href="https://thinkster.io">
            Thinkster
          </a>
          . Code &amp; design by Group 1.
        </span>

        <div className={styled.FNameMemBer}>
          <ul>
            <li>Duong Viet Duy</li>
            <li>Le Khanh Duy</li>
            <li>Nguyen Huu Hoang</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
