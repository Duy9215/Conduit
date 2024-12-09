import React, { useEffect, useState } from 'react';
import styled from '../assets/styles/Profile.module.css';
import { MdOutlineMonochromePhotos } from 'react-icons/md';
import { AiOutlineUser, AiOutlineMail, AiFillSetting } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import { getProfile, getArticles, updateUserProfile, getFavoriteArticles } from '../utils/Api';
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from 'react-bootstrap';

const YourProfile = () => {
   const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
   const [userProfile, setUserProfile] = useState();
   const [articles, setArticles] = useState([]);
   const [selectedComponent, setSelectedComponent] = useState('Blog');
   const [selectedAvatar, setSelectedAvatar] = useState(null);
   const [show, setShow] = useState(false);
   const [showSetting, setShowSetting] = useState(false);
   const [newUsername, setNewUsername] = useState('');
   const [newEmail, setNewEmail] = useState('');
   const [newBio, setNewBio] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [favoriteArticles, setFavoriteArticles] = useState([]);


   const [currentPage, setCurrentPage] = useState(1);
   const [postsPerPage] = useState(3);

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const handleCloseSetting = () => setShowSetting(false);
   const handleShowSetting = () => {
      if (userProfile) {
         setNewUsername(userProfile?.username);
         setNewEmail(user?.email || '');
         setNewBio(userProfile?.bio);
      }
      setShowSetting(true);
   };

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            if (user?.username) {
               const profile = await getProfile(user.username);
               console.log(profile);
               setUserProfile(profile.profile);
            }
         } catch (error) {
            console.error('Error fetching user profile:', error);
         }
      };

      const fetchUserArticles = async () => {
         try {
            const data = await getArticles();
            const storedArticles = JSON.parse(localStorage.getItem('articles')) || [];
            const userInfo = JSON.parse(localStorage.getItem('user-info'));
            const updatedArticles = storedArticles.map((article) => {
               if (article.author.username === userInfo.username) {
                  return {
                     ...article,
                     author: {
                        ...article.author,
                        username: userInfo.username,
                     }
                  };
               }
               return article;
            });

            setArticles([...updatedArticles, ...data.articles]);
         } catch (error) {
            console.error('Error fetching user articles:', error);
         }
      };

      const fetchFavoriteArticles = async () => {
         try {
            const data = await getFavoriteArticles();
            setFavoriteArticles(data);
         } catch (error) {
            console.error('Error fetching favorite articles:', error);
         }
      };

      fetchUserProfile();
      fetchUserArticles();
      fetchFavoriteArticles();
   }, []);

   const navigate = useNavigate();
   const handleToDetails = (slug) => {
      navigate("/articles/" + slug);
   };

   const handleLinkClick = (component) => {
      setSelectedComponent(component);
      setCurrentPage(1);
   };

   const handleAvatarSubmit = async () => {
      try {
         if (selectedAvatar) {
            const updatedUserData = {
               user: {
                  image: selectedAvatar
               }
            };

            const response = await updateUserProfile(updatedUserData);

            if (response.user && response.user.image) {
               setUserProfile(prevUserProfile => ({
                  ...prevUserProfile,
                  image: response.user.image
               }));

               const updatedUser = JSON.parse(localStorage.getItem('user-info'));
               updatedUser.image = response.user.image;
               localStorage.setItem('user-info', JSON.stringify(updatedUser));

               console.log('Avatar updated in state and localStorage:', updatedUser.image);
            }
         } else {
            console.error('No selected avatar.');
         }
      } catch (error) {
         console.error('Error updating avatar:', error);
      }
   };

   const handleSaveChanges = async () => {
      try {
         if (newPassword && newPassword !== confirmPassword) {
            alert("Mật khẩu không đúng, vui lòng nhập lại!");
            return;
         }

         const updatedUserData = {
            user: {
               username: newUsername,
               email: newEmail,
               bio: newBio,
               ...(newPassword && { password: newPassword })
            },
         };

         const response = await updateUserProfile(updatedUserData);

         if (response.user) {
            setUserProfile((prevUserProfile) => ({
               ...prevUserProfile,
               username: response.user.username,
               email: response.user.email,
               bio: response.user.bio,
            }));

            const updatedUser = JSON.parse(localStorage.getItem('user-info'));
            updatedUser.username = response.user.username;
            updatedUser.email = response.user.email;
            updatedUser.bio = response.user.bio;
            localStorage.setItem('user-info', JSON.stringify(updatedUser));

            console.log('Profile updated in state and localStorage:', updatedUser);
            handleCloseSetting();
         }
      } catch (error) {
         console.error('Error updating profile:', error);
      }
   };

   const indexOfLastPost = currentPage * postsPerPage;
   const indexOfFirstPost = indexOfLastPost - postsPerPage;
   const currentUserPosts = articles.filter(article => article.author.username === userProfile?.username)
      .slice(indexOfFirstPost, indexOfLastPost);

   const currentFavoritePosts = favoriteArticles.filter(article => article.favorited === true)
      .slice(indexOfFirstPost, indexOfLastPost);


   const totalUserPosts = articles.filter(article => article.author.username === userProfile?.username).length;
   const totalPagesUser = Math.ceil(totalUserPosts / postsPerPage);
   const pageNumbers = [...Array(totalPagesUser).keys()].map(number => number + 1);

   const totalFavoritePosts = favoriteArticles.filter(article => article.favorited === true).length;
   const totalPagesFavorite = Math.ceil(totalFavoritePosts / postsPerPage);
   const favoritePageNumbers = [...Array(totalPagesFavorite).keys()].map(number => number + 1);

   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   return (
      <div className={styled.BoxUser}>
         <div className={styled.UserHeader}>
            <Navbar isProfile={true} className={styled.NavPro} />
            <section className={styled.UserHeaderBg}>
               <div className={styled.UserBG}>
                  <img src="https://cdn-media.sforum.vn/storage/app/media/ctvseocps123/hinh-nen-8d-thumbnail.jpg" alt="Mô tả hình ảnh" />
               </div>
               <button className={styled.buttonPhoto} variant="primary" onClick={handleShow}>
                  <MdOutlineMonochromePhotos />
               </button>
               <div className={styled.UserImg}>
                  <img src={userProfile?.image} alt="Mô tả hình ảnh" />
               </div>
            </section>
         </div>

         <div className={styled.UserContent}>
            <div className={styled.BoxContent}>
               <div className={styled.LeftContent}>
                  <div className={styled.LeftCard}>
                     <header>
                        <p>Giới thiệu</p>
                     </header>
                     <div>
                        <div>
                           <p style={{ fontWeight: 'bolder' }}> <AiOutlineUser /> {userProfile?.username}</p>
                           <p>Bio: {userProfile?.bio}</p>
                        </div>
                        <Button className={styled.buttonSetting} variant="primary" onClick={handleShowSetting}>
                           Cài đặt <AiFillSetting />
                        </Button>
                     </div>
                  </div>
               </div>
               <div className={styled.RightConent}>
                  <div className={styled.RightCard}>
                     <header>
                        <p onClick={() => handleLinkClick('Blog')}>Bài Viết Của Bạn</p>
                        <p onClick={() => handleLinkClick('FavoriteBlog')}>Bài Viết Bạn Đã Thích</p>
                     </header>

                     <div className={styled.ListContent}>
                        {selectedComponent === 'Blog' &&
                           currentUserPosts.map(article => (
                              <div key={article.slug} className={styled.ItemContent} onClick={() => handleToDetails(article.slug)}>
                                 <div className={styled.ContentImg}>
                                    <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
                                 </div>
                                 <div className={styled.ContentInfor}>
                                    <p style={{ color: '#3498db' }}><img src={article.author?.image} className={styled.imageAuthor} alt="" />{article.author.username}</p>
                                    <h4>{article.title}</h4>
                                    <p>{article.description}</p>
                                 </div>
                              </div>
                           ))
                        }
                        {selectedComponent === 'FavoriteBlog' &&
                           currentFavoritePosts.map(article => (
                              <div key={article.slug} className={styled.ItemContent} onClick={() => handleToDetails(article.slug)}>
                                 <div className={styled.ContentImg}>
                                    <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
                                 </div>
                                 <div className={styled.ContentInfor}>
                                    <p style={{ color: '#3498db' }}><img src={article.author?.image} className={styled.imageAuthor} alt="" />{article.author.username}</p>
                                    <h4>{article.title}</h4>
                                    <p style={{ color: 'gray' }}>{article.description}</p>
                                 </div>
                              </div>
                           ))
                        }
                     </div>

                     <div className={styled.Pagination}>
                        {currentPage > 1 && (
                           <button
                              onClick={() => paginate(currentPage - 1)}
                              className={styled.Page}
                           >
                              &lt;
                           </button>
                        )}
                        <button className={`${styled.Page} ${styled.ActivePage}`}>
                           {currentPage}
                        </button>
                        {currentPage < (selectedComponent === 'Blog' ? totalPagesUser : totalPagesFavorite) && (
                           <button
                              onClick={() => paginate(currentPage + 1)}
                              className={styled.Page}
                           >
                              &gt;
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>


         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Update Avatar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form>
                  <Form.Group>
                     <Form.Label>Avatar URL</Form.Label>
                     <Form.Control
                        type="text"
                        value={selectedAvatar}
                        onChange={(e) => setSelectedAvatar(e.target.value)} // Lấy URL từ input
                        placeholder="Enter the URL of your avatar image"
                     />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>Close</Button>
               <Button variant="primary" onClick={handleAvatarSubmit}>Save</Button>
            </Modal.Footer>
         </Modal>

         {/* Modal for Profile Setting */}
         <Modal show={showSetting} onHide={handleCloseSetting}>
            <Modal.Header closeButton>
               <Modal.Title>Update Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form>
                  <Form.Group>
                     <Form.Label>Username</Form.Label>
                     <Form.Control
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label>Email</Form.Label>
                     <Form.Control
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label>Bio</Form.Label>
                     <Form.Control
                        type="text"
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label>Password</Form.Label>
                     <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label>Confirm Password</Form.Label>
                     <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                     />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseSetting}>Close</Button>
               <Button variant="primary" onClick={handleSaveChanges}>Save changes</Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default YourProfile;
