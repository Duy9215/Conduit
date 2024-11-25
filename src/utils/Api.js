import axios from "axios";

const API_REGISTER = 'https://node-express-conduit.appspot.com/api/users';
const API_LOGIN = 'https://node-express-conduit.appspot.com/api/users/login';
const API_NEWARTICLES = 'https://node-express-conduit.appspot.com/api/articles';

const user = JSON.parse(localStorage.getItem(`user-info`)) || {}
console.log(user.token);

export const registerUser = async (username, email, password) => {
    const user = {
        user: {
            username: username,
            email: email,
            password: password,
        }
    };

    try {
        const response = await axios.post(API_REGISTER, user);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    const user = {
        user: {
            email: email,
            password: password,
        },
    };

    try {
        const response = await axios.post(API_LOGIN, user, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response && response.data && response.data.user) {
            return response.data;
        } else {
            throw new Error("Đăng nhập không hợp lệ");
        }
    } catch (error) {
        throw error;
    }
};

// users
export async function getUser() {
    try {
        const token = localStorage.token;
        if (!token) {
            console.error('Not Token Authen.');
            return;
        }

        const response = await axios.get('https://node-express-conduit.appspot.com/api/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        throw error;
    }
}

// Update user's image
export async function updateUserImage(updatedUserData) {
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
    try {
        const response = await axios.put(`https://node-express-conduit.appspot.com/api/users`, updatedUserData, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${user.token}`
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error updating user image:', error);
        console.error('Error:', error.response);
        throw error;
    }
}

// Articles


export async function getArticles() {
    try {
        const response = await axios.get('https://node-express-conduit.appspot.com/api/articles', {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getArticlesDetails(slug) {
    const res = await axios.get(`https://node-express-conduit.appspot.com/api/articles/${slug}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
        },
    });

    return res.data
}

export const newArticle = async (title, description, body, tagList) => {
    const newArticle = {
        article: {
            title: title,
            description: description,
            body: body,
            tagList: [tagList]
        }
    };

    try {
        const response = await axios.post(API_NEWARTICLES, newArticle, {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export async function deleteArticleBySlug(slug) {
    try {
        const response = await axios.delete(`https://node-express-conduit.appspot.com/api/articles/${slug}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateArticleBySlug(slug, updatedData) {
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
    try {
        const response = await axios.put(
            `https://node-express-conduit.appspot.com/api/articles/${slug}`,
            updatedData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}


// Tags
export async function getTags() {
    const res = await axios.get('https://node-express-conduit.appspot.com/api/tags');
    return res.data
}

//Favorites


export async function favoriteArticle(slug) {
    try {

        const response = await axios.post(
            `https://node-express-conduit.appspot.com/api/articles/${slug}/favorite`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            }
        );
        console.log(user.token);
        return response.data;
    } catch (error) {
        console.error('error favorite article :', error);
        throw error;
    }
}



export async function unfavoriteArticle(slug) {
    try {
        const response = await axios.delete(
            `https://node-express-conduit.appspot.com/api/articles/${slug}/favorite`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('error unfavorite article', error);
        throw error;
    }
}

// Profile

export async function follow(username, token) {
    try {
        const response = await axios.post(
            `https://node-express-conduit.appspot.com/api/profiles/${username}/follow`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

export async function unfollow(username, token) {
    try {
        const response = await axios.delete(
            `https://node-express-conduit.appspot.com/api/profiles/${username}/follow`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}

export async function getProfile(username) {
    try {
        const response = await axios.get(`https://node-express-conduit.appspot.com/api/profiles/${username}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}


//comment

export async function getComments(slug) {
    const res = await axios.get(`https://node-express-conduit.appspot.com/api/articles/${slug}/comments`, {
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
        },
    });

    const processedComments = res.data.comments.map((comment) => {
        return {
            id: comment.id,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            body: comment.body,
            authorUsername: comment.author.username,
            authorImage: comment.author.image
        };
    });
    console.log(processedComments);
    return processedComments;
}

export const newComments = async (slug, body) => {
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};
    const newComments = {
        comment: {
            body: body
        }
    };
    console.log('newCommentData:', newComments);
    try {
        const response = await axios.post(`https://node-express-conduit.appspot.com/api/articles/${slug}/comments`, newComments, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteComment = async (slug, commentId) => {
    const user = JSON.parse(localStorage.getItem(`user-info`)) || {};

    try {
        const response = await axios.delete(`https://node-express-conduit.appspot.com/api/articles/${slug}/comments/${commentId}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}