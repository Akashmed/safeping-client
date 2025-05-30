import axiosSecure from ".";


// save user data to database
export const saveUser = async user => {
    const currentUser = {
        email: user.email,
        role: 'user',
        accountType: 'Basic',
        status: 'unverified'
    };

    // Use await to ensure the request is completed before destructuring
    const { data } = await axiosSecure.put(`/users/${user?.email}`, currentUser);

    return data;
};

// update user's phone number
export const updateUser = async (email, data) => {
    // Use await to ensure the request is completed before destructuring
    const response = await axiosSecure.patch(`/users/${email}`, data);

    return response.data;
};

// get user data from database
export const getUser = async email => {
    // Use await to ensure the request is completed before destructuring
    const { data } = await axiosSecure.get(`/users/${email}`);

    return data;
};

// get token 
export const getToken = async email => {
    const { data } = await axiosSecure.post('/jwt', { email });

    return data;
}

// clear cookie from browser
export const removeCookie = async () => {
    const { data } = await axiosSecure.get('/logout');

    return data;
}