import {
    addNewUser,
    authenticateUser,
    getAllUsers,
    deleteUser,
    getUserById
} from "../../models/users/users.model.js";

//Testin comment added

const httpAddNewUser = async (req, res) => {
    try {
        const response = await addNewUser(req.body);

        if (response.status) {
            res.status(201).send(response);
        } else {
            res.status(201).send(response);
        }
    } catch (err) {
        res.status(406).send(response);
    }
}

const httpAuthenticateUser = async (req, res) => {
    try {
        const response = await authenticateUser(req.body);

        if (response.status) {
            return res.status(200).send(response);
        } else {
            return res.status(200).send(response);
        }
    } catch (err) {
        return res.status(404).send(response);
    }
}

const httpGetAllUsers = async (req, res) => {
    try {
        const response = await getAllUsers();

        res.status(200).send(response);
    } catch (err) {
        res.status(406).send(err);
    }
}

const httpDeleteUser = async (req, res) => {
    try {
        const response = await deleteUser(req.params.id);

        if(response.status) {
            res.status(200).send(response);
        }
        else {
            res.status(200).send(response);
        }
    }
    catch(err) {
        res.status(406).send(err)
    }
}

const httpGetUserById = async (req, res) => {
    try {
        const response = await getUserById(req.params.id);
        res.status(200).send(response);
    }
    catch(err) {
        res.status(404).send(err);
    }
}

export {
    httpAddNewUser,
    httpAuthenticateUser,
    httpGetAllUsers,
    httpDeleteUser,
    httpGetUserById
}