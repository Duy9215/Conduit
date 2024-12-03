import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Form, Button } from "react-bootstrap";
import styles from "../assets/styles/BlogDetails.module.css";
import {
    getArticlesDetails,
    favoriteArticle,
    unfavoriteArticle,
    follow,
    unfollow,
    deleteArticleBySlug,
    newComments,
    getComments,
    deleteComment,
} from "../utils/Api";
import Footer from "./Footer";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";

const BlogDetails = () => {
    const { slug } = useParams();
    const [blogDet, setBlogDet] = useState(null);
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [currentSlug, setCurrentSlug] = useState(slug);
    const navigate = useNavigate();

    useEffect(() => {
        getArticlesDetails(currentSlug)
            .then((blogDet) => {
                setBlogDet(blogDet);
            })
            .catch((error) => {
                console.error("Lỗi dữ liệu:", error);
            });

        getComments(currentSlug)
            .then((fetchedComments) => {
                console.log("Dữ liệu bình luận từ API:", fetchedComments);
                setComments(fetchedComments);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy bình luận:", error.response.data);
            });
    }, [currentSlug]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleFavoriteClick = async () => {
        try {
            if (blogDet?.article?.favorited) {
                await unfavoriteArticle(slug);
            } else {
                await favoriteArticle(slug);
            }

            const updatedBlogDet = { ...blogDet };
            updatedBlogDet.article.favorited = !updatedBlogDet.article.favorited;
            updatedBlogDet.article.favoritesCount += updatedBlogDet.article.favorited
                ? 1
                : -1;
            setBlogDet(updatedBlogDet);
        } catch (error) {
            console.error("Lỗi khi xử lý yêu thích bài viết:", error);
        }
    };
    const handleFollowClick = async () => {
        try {
            const isFollowing = blogDet?.article?.author?.following;

            if (isFollowing) {
                await unfollow(blogDet?.article?.author?.username, user.token);
            } else {
                await follow(blogDet?.article?.author?.username, user.token);
            }

            const updatedBlogDet = { ...blogDet };
            updatedBlogDet.article.author.following = !isFollowing;

            setBlogDet(updatedBlogDet);
        } catch (error) {
            console.error("Error following/unfollowing:", error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await deleteArticleBySlug(slug, user.token);
            navigate("/");
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    const handleUpdateArticle = () => {
        navigate(`/articlesedit/${slug}`, {
            state: {
                title: blogDet?.article?.title,
                description: blogDet?.article?.description,
                body: blogDet?.article?.body,
                tagList: blogDet?.article?.tagList,
            },
        });
    };

    console.log(user);

    const handlePostComment = async () => {
        try {
            if (newComment.trim() === "") {
                // Ngăn việc gửi bình luận trống
                return;
            }

            const response = await newComments(currentSlug, newComment);
            const newCommentData = {
                id: response.comment.id,
                createdAt: response.comment.createdAt,
                body: response.comment.body,
                authorUsername: user.username,
                authorImage: user.image,
            };

            // Thêm bình luận mới vào danh sách comments
            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment("");
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(currentSlug, commentId);
            // Xoá bình luận khỏi danh sách hiện tại
            const updatedComments = comments.filter(
                (comment) => comment.id !== commentId
            );
            setComments(updatedComments);
        } catch (error) {
            console.error("Lỗi khi xoá bình luận:", error);
        }
    };

    return (
        <>
            <Navbar />
            {user.username === blogDet?.article?.author?.username ? (
                <div className={styles.container}>
                    <div className={styles.infoArea}>
                        <div className={styles.headerInfo}>
                            <p>{blogDet?.article?.author?.username}</p>
                        </div>
                        <div className={styles.headerButtons}>
                            <button onClick={handleFollowClick}>
                                <button onClick={handleUpdateArticle}>
                                    <p>Update</p>
                                </button>
                            </button>
                            <button onClick={handleFavoriteClick}>
                                <button onClick={handleDeleteClick}>
                                    <p>Delete</p>
                                </button>
                            </button>
                        </div>
                    </div>

                    <div className={styles.blogBox}>
                        <header className={styles.blogHeader}>
                            <h1>{blogDet?.article?.title}</h1>
                        </header>
                        <div className={styles.blogContent}>
                            <div className={styles.blogContentText}>
                                <p>
                                    <i>Update: {formatDate(blogDet?.article?.createdAt)}</i>
                                </p>
                                {blogDet?.article?.body}
                            </div>

                            <div className={styles.blogTags}>
                                {blogDet?.article?.tagList.map((tag, index) => (
                                    <span key={index}>#{tag} </span>
                                ))}
                            </div>
                        </div>
                        <footer className={styles.commentFooter}>
                            Comment
                            <div className={styles.commentBox}>
                                <div className={styles.comment}>
                                    <div className={styles.commentText}>
                                        <div>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="exampleForm.ControlTextarea1"
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={newComment} // Bind the value to the state
                                                    onChange={(e) => setNewComment(e.target.value)} // Update the state when input changes
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className={styles.postComment}>
                                            <img
                                                src={user?.image}
                                                alt="User Avatar"
                                                className={styles.avatar}
                                            />
                                            <Button
                                                className="float-end"
                                                type="submit"
                                                variant="outline-primary"
                                                onClick={handlePostComment} // Call the function to post comment when button is clicked
                                            >
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {comments.map((comment, index) => (
                                    <div key={index} className={styles.commentsSection}>
                                        <p style={{ wordWrap: "break-word" }}>{comment.body}</p>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex">
                                                <img
                                                    src={comment.authorImage}
                                                    className={styles.avatarAuthor}
                                                    alt="Tác giả"
                                                />
                                                <p className={styles.authorName}>
                                                    {comment.authorUsername}
                                                </p>
                                                <p
                                                    className="mx-3"
                                                    style={{ fontSize: "15px", color: "#6c757d" }}
                                                >
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                style={{ border: "none", background: "white" }}
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </footer>
                    </div>
                </div>
            ) : (
                <div className={styles.container}>
                    <div className={styles.infoArea}>
                        <div className={styles.headerInfo}>
                            <p>{blogDet?.article?.author?.username}</p>
                        </div>
                        <div className={styles.headerButtons}>
                            <button
                                onClick={handleFollowClick}
                                className={
                                    blogDet?.article?.author?.following
                                        ? styles.UnfavoriteButton
                                        : styles.favoriteButton
                                }
                            >
                                <span>{blogDet?.article?.author?.following ? "+ " : "- "}</span>
                                <p>
                                    {blogDet?.article?.author?.following
                                        ? "UnFollow "
                                        : "Follow "}
                                </p>
                                <p>{blogDet?.article?.author?.username}</p>
                            </button>
                            <button
                                onClick={handleFavoriteClick}
                                className={
                                    blogDet?.article?.favorited
                                        ? styles.UnfavoriteButton
                                        : styles.favoriteButton
                                }
                            >
                                <span>
                                    <BsFillSuitHeartFill />{" "}
                                    {blogDet?.article?.favorited ? "UnFavorite" : "Favorite"}
                                </span>
                                <p> {blogDet?.article?.favoritesCount}</p>
                            </button>
                        </div>
                    </div>

                    <div className={styles.blogBox}>
                        <header className={styles.blogHeader}>
                            <h1>{blogDet?.article?.title}</h1>
                        </header>
                        <div className={styles.blogContent}>
                            <div className={styles.blogContentText}>
                                <p>
                                    <i>Update: {formatDate(blogDet?.article?.createdAt)}</i>
                                </p>
                                {blogDet?.article?.body}
                            </div>

                            <div className={styles.blogTags}>
                                {blogDet?.article?.tagList.map((tag, index) => (
                                    <span key={index}>#{tag} </span>
                                ))}
                            </div>
                        </div>

                        <footer className={styles.commentFooter}>
                            Comment
                            <div className={styles.commentBox}>
                                <div className={styles.comment}>
                                    <div className={styles.commentText}>
                                        <div>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="exampleForm.ControlTextarea1"
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div>
                                            <img
                                                src={user.image}
                                                alt="User Avatar"
                                                className={styles.avatar}
                                            />
                                            <Button
                                                className="float-end"
                                                type="submit"
                                                variant="outline-primary"
                                                onClick={handlePostComment}
                                            >
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {comments.map((comment, index) => (
                                <div key={index} className={styles.commentsSection}>
                                    <p>{comment.body}</p>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <img
                                                src={comment.authorImage}
                                                className={styles.avatarAuthor}
                                                alt="Tác giả"
                                            />
                                            <p className={styles.authorName}>
                                                {comment.authorUsername}
                                            </p>
                                            <p
                                                className="mx-3"
                                                style={{ fontSize: "15px", color: "#6c757d" }}
                                            >
                                                {comment.createdAt}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            style={{ border: "none", background: "white" }}
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </footer>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default BlogDetails;