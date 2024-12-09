import React, { useEffect, useState } from 'react';
import styled from '../assets/styles/Profile.module.css';
import { MdOutlineMonochromePhotos } from 'react-icons/md';
import { AiOutlineUser, AiOutlineMail, AiFillSetting } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import { getProfile, getArticles, updateUserImage } from '../utils/Api';
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

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const handleCloseSetting = () => setShowSetting(false);
   const handleShowSetting = () => {
      setNewUsername(userProfile.username);
      setNewEmail(userProfile.email);
      setNewBio(userProfile.bio);
      setShowSetting(true);
   };

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            if (user?.username) {
               const profile = await getProfile(user.username);
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

      fetchUserProfile();
      fetchUserArticles();
   }, []);

   const navigate = useNavigate();
   const handleToDetails = (slug) => {
      navigate("/articles/" + slug);
   };

   const handleLinkClick = (component) => {
      setSelectedComponent(component);
   };

   const handleAvatarSubmit = async () => {
      try {
         if (selectedAvatar) {
            const updatedUserData = {
               user: {
                  image: selectedAvatar // Sử dụng đường dẫn đã nhập bởi người dùng
               }
            };

            const response = await updateUserImage(updatedUserData); // Gửi dữ liệu đã cập nhật đến API

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
         const updatedUserData = {
            user: {
               username: newUsername,
               email: newEmail,
               bio: newBio,
            }
         };

         const response = await updateUserImage(updatedUserData); // Gửi dữ liệu đã cập nhật đến API

         if (response.user) {
            setUserProfile(prevUserProfile => ({
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

   return (
      <div className={styled.BoxUser}>
         <div className={styled.UserHeader}>
            <Navbar isProfile={true} className={styled.NavPro} />
            <section className={styled.UserHeaderBg}>
               <div className={styled.UserBG}>
                  <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
               </div>
               <button className={styled.buttonPhoto} variant="primary" onClick={handleShow}>
                  <MdOutlineMonochromePhotos />
               </button>
               <div className={styled.UserImg}>
                  <img src={userProfile?.image} alt="Mô tả hình ảnh" />
                  <Modal show={show} onHide={handleClose}>
                     <Modal.Header closeButton>
                        <Modal.Title>Change Avatar</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <input
                           type="text"
                           placeholder="Enter image URL"
                           value={selectedAvatar || ''}
                           onChange={(event) => setSelectedAvatar(event.target.value)}
                        />
                        {selectedAvatar && (
                           <img
                              src={selectedAvatar}
                              alt="Selected Avatar"
                              style={{ maxWidth: '100%', maxHeight: '300px' }}
                           />
                        )}
                     </Modal.Body>
                     <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                           Close
                        </Button>
                        <Button variant="primary" onClick={handleAvatarSubmit}>
                           Save Changes
                        </Button>
                     </Modal.Footer>
                  </Modal>
                  <div>
                     <Modal show={showSetting} onHide={handleCloseSetting}>
                        <Modal.Header closeButton>
                           <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <Form>
                              <Form.Group className="mb-3" controlId="formBasicUsername">
                                 <Form.Label>Username</Form.Label>
                                 <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={newUsername}
                                    onChange={(event) => setNewUsername(event.target.value)}
                                 />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="formBasicEmail">
                                 <Form.Label>Email</Form.Label>
                                 <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={newEmail}
                                    onChange={(event) => setNewEmail(event.target.value)}
                                 />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="formBasicBio">
                                 <Form.Label>Bio</Form.Label>
                                 <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter bio"
                                    value={newBio}
                                    onChange={(event) => setNewBio(event.target.value)}
                                 />
                              </Form.Group>
                           </Form>
                        </Modal.Body>
                        <Modal.Footer>
                           <Button variant="secondary" onClick={handleCloseSetting}>
                              Close
                           </Button>
                           <Button variant="primary" onClick={handleSaveChanges}>
                              Save Changes
                           </Button>
                        </Modal.Footer>
                     </Modal>

                  </div>
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
                           <AiOutlineUser /> {userProfile?.username}
                           <p>Bio: {userProfile?.bio}</p>
                        </div>

                        <p></p>
                        <Button className={styled.buttonSetting} variant="primary" onClick={handleShowSetting}>
                           Setting <AiFillSetting />
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
                        {articles
                           .filter(article => {
                              if (selectedComponent === 'Blog') {
                                 return article.author.username === userProfile?.username;
                              } else if (selectedComponent === 'FavoriteBlog') {
                                 return article.favorited === true;
                              }
                              return true; // Show all articles if no specific section is selected
                           })
                           .map(article => (
                              <div key={article.slug} className={styled.ItemContent} onClick={() => handleToDetails(article.slug)}>
                                 <div className={styled.ContentImg}>
                                    <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
                                 </div>
                                 <div className={styled.ContentInfor}>
                                    <h4>{article.title}</h4>
                                    <p>{article.description}</p>
                                 </div>
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default YourProfile;
