import React, { useState, useEffect } from 'react';
import { Container, Button, Form, FloatingLabel } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import styled from '../assets/styles/Profile.module.css';
import { updateArticleBySlug } from '../utils/Api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditAritcle = () => {
    const { slug } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [body, setBody] = useState('');
    const [tagList, setTagList] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { title, description, body, tagList } = location.state;
            if (!title && !description && !body) {
                return;
            }
            setTitle(title || '');
            setDescription(description || '');
            setBody(body || '');
            setTagList(tagList || '');
        }
        if (showSuccess) {
            const timeout = setTimeout(() => {
                navigate('/yourprofile');
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [location, showSuccess, navigate]);
    console.log(location.state);


    const handleUpdateArticle = async (e) => {
        e.preventDefault();

        if (!slug || !title || !description || !body) {
            console.error('Missing required data');
            return;
        }

        try {
            await updateArticleBySlug(slug, { article: { title, description, body, tagList } });
            toast.success("Chỉnh sửa thành công!", { autoClose: 1000, position: "top-center" });
            setShowSuccess(true);
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };


    return (
        <div>
            <Navbar className={styled.NavPro} />
            <div style={{ paddingTop: '7rem' }}>
                <Container>
                    <div className='fs-1 monospace'>Update Article</div>
                    <Form onSubmit={handleUpdateArticle}>
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
                            <Button type="submit" size="lg">Update Article</Button>
                        </div>
                    </Form>
                </Container>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditAritcle;