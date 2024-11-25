import React from 'react';
import styled from '../assets/styles/Footer.module.css'

const Footer = () => {
    return (
        <div className={styled.PageContainer}>
            <div className={styled.BoxFooter}>
                <div className={styled.FLOGO}>GR1</div>
                <div className={styled.FNameMemBer}>
                    <ul>
                        <li>KDuyGioTai</li>
                        <li>DDuyKC</li>
                        <li>HoangKC</li>
                        
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;