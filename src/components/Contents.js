import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../assets/styles/Contents.module.css';
import Blog from './Blog';
import BlogYourFeed from './BlogYourFeed';
const Contents = () => {
    const [selectedComponent, setSelectedComponent] = useState('Blog');

    const handleLinkClick = (component) => {
        setSelectedComponent(component);
    };

    return (
        <div className={styles.content}>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            className={`${selectedComponent === 'Blog' ? styles.active : ''
                                }`}
                            onClick={() => handleLinkClick('Blog')}
                        >
                            Blogs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={`${selectedComponent === 'BlogYourFeed' ? styles.active : ''
                                }`}
                            onClick={() => handleLinkClick('BlogYourFeed')}
                        >
                            Your Feed
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {selectedComponent === 'Blog' ? <Blog /> : null}
            {selectedComponent === 'BlogYourFeed' ? <BlogYourFeed /> : null}
        </div>
    );
};

export default Contents;