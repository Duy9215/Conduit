import React, { useState, useEffect, createContext } from 'react';
import styled from '../assets/styles/Blog.module.css';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { LuMoreHorizontal } from 'react-icons/lu';
import { getArticles, getTags, favoriteArticle, unfavoriteArticle } from '../utils/Api';
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export const ArticlesContext = createContext({ articles: [], setArticles: () => { } });

const Blog = () => {
    const [articles, setArticles] = useState([]);
    const [hotTags, setHotTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articleData = await getArticles(user.token);
                setArticles(articleData.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        const fetchTags = async () => {
            try {
                const tagData = await getTags();
                setHotTags(tagData.tags);
            } catch (error) {
                console.error('Error fetching hotTags:', error);
            }
        };

        fetchArticles();
        fetchTags();
    }, [user.token]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastArticle = Math.min(currentPage * ITEMS_PER_PAGE, articles.length);
    const indexOfFirstArticle = Math.max(indexOfLastArticle - ITEMS_PER_PAGE, 0);
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const renderPagination = () => {
        const pageNumbers = Math.ceil(articles.length / ITEMS_PER_PAGE);

        return (
            <div className={styled.Pagination}>
                {Array.from({ length: pageNumbers }, (_, index) => (
                    <span
                        key={index}
                        className={currentPage === index + 1 ? styled.ActivePage : styled.Page}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </span>
                ))}
            </div>
        );
    };

    const handleToDetails = (slug) => {
        navigate("/articles/" + slug);
    };

    const handleFavoriteClick = async (slug) => {
        try {
            const articleIndex = articles.findIndex(article => article.slug === slug);
            if (articleIndex === -1) return;

            const updatedArticles = [...articles];
            const article = updatedArticles[articleIndex];

            if (article.favorited) {
                await unfavoriteArticle(slug);
            } else {
                await favoriteArticle(slug);
            }

            article.favorited = !article.favorited;
            article.favoritesCount += article.favorited ? 1 : -1;
            setArticles(updatedArticles);
        } catch (error) {
            console.error('Error when handling favorites:', error);
        }
    };

    const navigate = useNavigate();

    return (
        <ArticlesContext.Provider value={{ articles, setArticles }}>
            <div className={styled.BoxBlog}>
                <div className={styled.HeaderInfor}>
                    <h1>Bài viết dành cho bạn</h1>
                    <p>Tổng hợp các bài viết GR1</p>
                </div>

                <div className={styled.BoxContent}>
                    <div className={styled.RightContent}>
                        {currentArticles.map((article, index) => (
                            <div key={index} className={styled.ItemBlog}>
                                <header className={styled.Header}>
                                    <div className={styled.nameUser}>
                                        <img src={article.author.image} alt="" className={styled.imageAuthor} />
                                        {article.author.username}
                                    </div>
                                    <div>
                                        {article.favoritesCount} <BsFillBookmarkFill
                                            onClick={() => handleFavoriteClick(article.slug)}
                                            className={article.favorited ? styled.UnfavoriteButton : styled.favoriteButton}
                                        /> <LuMoreHorizontal />
                                    </div>
                                </header>
                                <div className={styled.ContentIteam} onClick={() => handleToDetails(article.slug)}>
                                    <h2>{article.title}</h2>
                                    <figcaption>{article.description}</figcaption>
                                </div>
                                <footer className={styled.FooterIteam}>
                                    <div>
                                        {article.tagList.map((tag, index) => (
                                            <span key={index}>#{tag} </span>
                                        ))}
                                    </div>
                                    <div>{formatDate(article.createdAt)}</div>
                                </footer>
                            </div>
                        ))}
                        {renderPagination()}
                    </div>

                    <div className={styled.LeftContent}>
                        <h3 className={styled.NameTopicTags}>CÁC CHỦ ĐỀ ĐƯỢC ĐỀ XUẤT</h3>
                        <div className={styled.Tags}>
                            {hotTags.map((tag, index) => (
                                <span key={index}>#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ArticlesContext.Provider>
    );
};

export default Blog;
