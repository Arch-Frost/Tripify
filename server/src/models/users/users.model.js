import users from './users.mongo.js';

const getLatestUserId = async () => {
    const latestId = await users.findOne().sort('-id');
    if(!latestId) {
        return 1;
    }
    return latestId.id + 1;
}

const addNewUser = async (userData) => {
    try {
        const newUserId = await getLatestUserId();

        if((await users.find({email: userData.email})).length > 0) {
            return {
                status: false,
                message: "User already exists!"
            }
        }
        else {
            try {
                await users.create({
                    id: newUserId,
                    ...userData
                })

                return {
                    status: true,
                    message: "User created successfully!"
                }
            }
            catch(err) {
                return {
                    status: false,
                    message: "User couldn't be created, please try again!"
                }
            }
        }
    }
    catch(err) {
        return {
            status: false,
            message: "User could not be created, please try again!" 
        }
    }
}

const authenticateUser = async (userData) => {
    try {
        if(await users.findOne({email: userData.email})) {
            const result = await users.findOne({email: userData.email, password: userData.password}); 
            if(result) {
                return {
                    result,
                    status: true,
                    message: "User verified successfully!"
                }
            }
            else {
                return {
                    status: false,
                    message: "Incorrect Password!"
                }
            }
        }
        else {
            return {
                status: false,
                message: "User not found!"
            }
        }
        
    }
    catch (err) {
        return {
            status: false,
            message: "Please try again!"
        }
    }
}

const getAllUsers = async () => {
    try {
        const result = await users.find();
        return {
            result,
            status: true
        }
    }
    catch(err) {
        return {
            status: false
        }
    }
}

const deleteUser = async (id) => {
    try { 
        await users.deleteOne({id});

        return {
            status: true,
            message: 'User deleted successfully!'
        }
    }
    catch(err) {
        return {
            status: false
        }
    }
}

const getUserById = async (id) => {
    try {
        const result = await users.findOne({id});

        if(result) {
            return {
                result,
                status: true
            }
        }
        else {
            return {
                status: false
            }
        }
    }
    catch(err) {
        return {
            status: false,
        }
    }
}

export {
    addNewUser,
    authenticateUser,
    getAllUsers,
    deleteUser,
    getUserById
}

