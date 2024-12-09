import React, { useState, useEffect, createContext } from 'react';
import styled from '../assets/styles/Blog.module.css';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { LuMoreHorizontal } from 'react-icons/lu';
import { getArticles, getTags, favoriteArticle, unfavoriteArticle, getYourFeed } from '../utils/Api';
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export const ArticlesContext = createContext({ articles: [], setArticles: () => { } });

const Blog = () => {
    const [articles, setArticles] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const [hotTags, setHotTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {}
    const [checkUser, setCheckUser] = useState(false)

    useEffect(() => {
        getYourFeed()
            .then((data) => {
                setArticles(data.articles);
                setAllArticles(data.articles)
            })
            .catch((error) => {
                console.error("Error loading your feed:", error)
            });

        getTags()
            .then((data) => {
                setHotTags(data.tags);
                console.log(data.tags);
            })
            .catch((error) => {
                console.error('Error fetching hotTags:', error);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastArticle = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstArticle = indexOfLastArticle - ITEMS_PER_PAGE;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const renderPagination = () => {
        const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
        const pageNeighbours = 2; // Số trang liền kề hiển thị
        const startPage = Math.max(1, currentPage - pageNeighbours);
        const endPage = Math.min(totalPages, currentPage + pageNeighbours);

        const handlePageChange = (page) => {
            setCurrentPage(page);
        };

        return (
            <div className={styled.Pagination}>
                {currentPage > 1 && (
                    <>
                        <span onClick={() => handlePageChange(1)} className={styled.Page}>
                            Đầu
                        </span>
                        <span onClick={() => handlePageChange(currentPage - 1)} className={styled.Page}>
                            &laquo;
                        </span>
                    </>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
                    <span
                        key={page}
                        className={currentPage === page ? styled.ActivePage : styled.Page}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </span>
                ))}
                {currentPage < totalPages && (
                    <>
                        <span onClick={() => handlePageChange(currentPage + 1)} className={styled.Page}>
                            &raquo;
                        </span>
                        <span onClick={() => handlePageChange(totalPages)} className={styled.Page}>
                            Cuối
                        </span>
                    </>
                )}
            </div>
        );
    };

    const findHotTags = (tag) => {
        // Lọc các bài viết theo tag
        const filteredArticles = allArticles.filter(article =>
            article.tagList.includes(tag)
        );
        setArticles(filteredArticles);
    };

    // Quay lại tất cả bài viết nếu người dùng không muốn lọc theo tag nữa
    const resetArticles = () => {
        setArticles(allArticles);
    };
    const navigate = useNavigate();
    const handleToDetails = (slug) => {
        navigate("/articles/" + slug);
    };

    const handleProfile = (username) => {

        (user.username === username) ? (navigate("/yourprofile")) : (navigate("/profiles/" + username))

    };
    const handleFavoriteClick = async (slug) => {
        try {
            const articleIndex = articles.findIndex(article => article.slug === slug);

            if (articleIndex === -1) {
                return;
            }

            const updatedArticles = [...articles];
            const article = updatedArticles[articleIndex];

            if (article.favorited) {
                await unfavoriteArticle(slug, user.token);
            } else {
                await favoriteArticle(slug, user.token);
            }

            article.favorited = !article.favorited;
            article.favoritesCount += article.favorited ? 1 : -1;

            setArticles(updatedArticles);
        } catch (error) {
            console.error('Lỗi khi xử lý yêu thích bài viết:', error);
        }
    };

    const filteredFavoritedArticles = currentArticles.filter(article => article?.author.following === true);



    return (
        <ArticlesContext.Provider value={{ articles, setArticles }}>
            <div className={styled.BoxBlog}>
                <div className={styled.HeaderInfor}>
                    <h1>Bài viết dành cho bạn</h1>
                    <p>Tổng hợp các bài viết G1FA</p>
                </div>

                <div className={styled.BoxContent}>
                    <div className={styled.RightContent}>
                        {filteredFavoritedArticles.map((article) => (
                            <div key={article.slug} className={styled.ItemBlog}>
                                <header className={styled.Header}>
                                    <div onClick={() => handleProfile(article.author.username)} className={styled.nameUser}>
                                        <img src={article.author.image} className={styled.imageAuthor} alt="" />
                                        <span> {article.author.username}</span>
                                    </div>
                                    <div>
                                        {article.favoritesCount}   <BsFillBookmarkFill
                                            onClick={() => handleFavoriteClick(article.slug)}
                                            className={article.favorited ? styled.UnfavoriteButton : styled.favoriteButton}
                                        /> <LuMoreHorizontal />
                                    </div>
                                </header>
                                <div className={styled.ContentIteam} onClick={() => handleToDetails(article.slug)}>
                                    <h2>{article.title}</h2>
                                    <figcaption style={{ color: 'gray' }}>{article.description}</figcaption>
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
                                <span key={index} onClick={() => findHotTags(tag)}>#{tag} </span>
                            ))}
                        </div>
                        <div className={styled.ads}>

                        </div>
                    </div>
                </div>
            </div>
        </ArticlesContext.Provider>
    );
};

export default Blog;