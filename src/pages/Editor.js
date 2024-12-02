// ...
import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Form, FloatingLabel } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import styled from '../assets/styles/Profile.module.css';
import { newArticle } from '../utils/Api';
import { useNavigate } from 'react-router-dom';
import { ArticlesContext } from '../components/Blog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagList, setTagList] = useState('');
  const navigate = useNavigate();

  const { articles, setArticles } = useContext(ArticlesContext);

  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const userToken = userInfo.token;

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showSuccess, navigate]);

  const handleNewArticle = async (e) => {
    e.preventDefault();

    try {
      if (!title || !description || !body || !tagList) {
        toast.error("Điền đầy đủ thông tin vào!!!", { autoClose: 2000, position: "top-center" });
        return;
      }

      const response = await newArticle(title, description, body, tagList, userToken);
      console.log('Bài viết đã được tạo:', response);

      setArticles([...articles, response.article]);

      toast.success("ok rồi nhá!", { autoClose: 1000, position: "top-center" });
      setShowSuccess(true);

    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error.message);
    }
  };

  return (
    <>
      <div>
        <Navbar className={styled.NavPro} />
      </div>
      <div style={{ paddingTop: '7rem' }}>
        <Container>
          <div className='fs-1 monospace'>New Article</div>
          <Form onSubmit={handleNewArticle}>
            <Form.Group className="mb-3">
              <Form.Control size="lg" type="text" placeholder="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="What's this article about?" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <FloatingLabel controlId="floatingTextarea2" className='mb-3'>
              <Form.Control
                as="textarea"
                placeholder=""
                style={{ height: '200px' }}
                value={body} onChange={(e) => setBody(e.target.value)}
              />
            </FloatingLabel>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Enter tags" value={tagList} onChange={(e) => setTagList(e.target.value)} />
            </Form.Group>
            <div className="mb-2 float-end">
              <Button type="submit" size="lg">Publish Article</Button>
            </div>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default Editor;