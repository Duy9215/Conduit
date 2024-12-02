import React, { useEffect, useState } from 'react';
import styled from '../assets/styles/Profile.module.css';
import { MdOutlineMonochromePhotos } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import { getProfile, getArticles, follow, unfollow } from '../utils/Api';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Profile = () => {
   const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
   const [userProfile, setUserProfile] = useState(null);
   const { username } = useParams();
   const [articles, setArticles] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            const profile = await getProfile(username);
            setUserProfile(profile.profile);
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
   }, [username]);

   const handleToDetails = (slug) => {
      navigate("/articles/" + slug);
   };

   const handleFollowClick = async () => {
      try {
         const isFollowing = userProfile?.following;

         if (isFollowing) {
            await unfollow(username, user.token);
         } else {
            await follow(username, user.token);
         }

         setUserProfile(prevProfile => ({
            ...prevProfile,
            following: !isFollowing,
         }));

      } catch (error) {
         console.error('Error following/unfollowing:', error);
      }
   };
   console.log(userProfile);

   return (
      <div className={styled.BoxUser}>
         <div className={styled.UserHeader}>
            <Navbar isProfile={true} className={styled.NavPro} />
            <section className={styled.UserHeaderBg}>
               <div className={styled.UserBG}>
                  <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
               </div>
               <button>
                  <MdOutlineMonochromePhotos />Change Photo
               </button>
               <div className={styled.UserImg}>
                  <img src={userProfile?.image} alt="" />
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
                     <div className={styled.userBtn}>
                        <AiOutlineUser /> {userProfile?.username}
                        <button onClick={handleFollowClick} className={userProfile?.following ? styled.UnfavoriteButton : styled.favoriteButton}>
                           <p>{userProfile?.following ? 'UnFollow ' : 'Follow '}</p>
                           <p>{username}</p>
                        </button>
                        <p></p>
                     </div>
                  </div>
               </div>
               <div className={styled.RightConent}>
                  <div className={styled.RightCard}>
                     <header>
                        <p>Bài Viết Của <span>{username}</span></p>
                     </header>

                     <div className={styled.ListContent}>
                        {articles
                           .filter(article => article.author.username === userProfile?.username)
                           .map((article) => (
                              <div key={article.slug} className={styled.ItemContent} onClick={() => handleToDetails(article.slug)}>
                                 <div className={styled.ContentImg}>
                                    <img src="https://wallpapers.com/images/hd/blue-aesthetic-moon-df8850p673zj275y.jpg" alt="Mô tả hình ảnh" />
                                 </div>
                                 <div className={styled.ContentInfor} >
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

export default Profile;