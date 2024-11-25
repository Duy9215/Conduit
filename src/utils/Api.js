import axios from "axios";

const API_LOGIN = 'https://node-express-conduit.appspot.com/api/users/login';

const user = JSON.parse(localStorage.getItem(`user-info`)) || {}
console.log(user.token);

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