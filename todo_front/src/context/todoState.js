import React, {useState} from "react";
import todoContext from "./todoContext";
import {Buffer} from 'buffer';


var CryptoJS = require("crypto-js");

const TodoState = (props) => {
    const host = 'http://127.0.0.1:8000/api/v1'
    const Secretkey = 'Rkahf0$924i$Xdjaflfa#345'
    const [listTasks, setListTasks] = useState([])

    // this is utils function for utils ------------------------------
    const setCookie = (key, value) => {
        let encrypted = CryptoJS.AES.encrypt(value.toString(), Secretkey);
        document.cookie = key + '=' + (encrypted || '');
    };

    const getCookie = key => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${key}=`);

        if (parts.length === 2) {
            let encryptedToken = parts.pop().split(';').shift();
            let decrypted = CryptoJS.AES.decrypt(encryptedToken, Secretkey);
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
    };

    const eraseCookie = key => {
        document.cookie = key + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    const decrypt_Token = (token) => {
        var result = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        setCookie('access_token', token)
        setCookie('user_id', result.user_id)

    }

    // -=---------------------------------------------------
    // Login

    const loginUser = async (credentials) => {
        const response = await fetch(`${host}/accounts/signin`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json',},
            body: JSON.stringify({username: credentials.username, password: credentials.password})
        });
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            decrypt_Token(jsonResponse.access_token);
        }
        return jsonResponse
    }

    const SignUpUser = async (credentials) => {
        const response = await fetch(`${host}/accounts/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "access_token": getCookie("access_token")
            },
            body: JSON.stringify({
                username: credentials.username, email: credentials.email,
                password: credentials.password, password_too: credentials.password_too
            })
        });
        const jsonResponse = await response.json();
        return jsonResponse
    }


    // -=---------------------------------------------------
    // Task

    const CreateTask = async (task) => {
        const response = await fetch(`${host}/task/create/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": getCookie("access_token")},
            body: JSON.stringify({title: task.title, description: task.description})
        });
        const jsonResponse = await response.json();    
        return jsonResponse
    }

    const getListTasks = async () =>{
        const response = await fetch(`${host}/task/list/`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json','Accept': 'application/json', "Authorization": getCookie("access_token")},
        });
        const jsonResponse = await response.json();
        setListTasks(jsonResponse.tasks)
    }
    const getListTasksByFilter = async (status) =>{
        if (status === 'All'){
            var url = `${host}/task/list/`
        }
        else{
            var url = `${host}/task/list_filter/?status=${status}`
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json','Accept': 'application/json', "Authorization": getCookie("access_token")},
        });
        const jsonResponse = await response.json();
        setListTasks(jsonResponse.tasks)
    }
    const DeleteTask = async (id) => {
        const response = await fetch(`${host}/task/delete/${id}/`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',  "Authorization": getCookie("access_token")},
        });
        const jsonResponse = await response.json();    
        return jsonResponse
    }
    const UpdateTask = async (id, task) => {
        const response = await fetch(`${host}/task/update/${id}/`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": getCookie("access_token")},
            body: JSON.stringify({title: task.title, description: task.description})
        });
        const jsonResponse = await response.json();    
        return jsonResponse
    }
    const UpdateStatusTask = async (id, status) => {
        console.log("id status", id, status)
        const response = await fetch(`${host}/task/update/${id}/`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": getCookie("access_token")},
            body: JSON.stringify({status: status})
        });
        const jsonResponse = await response.json();    
        return jsonResponse
    }

    const [alert, setAlert] = useState(null);
    const showAlert = (message, type) => {
        setAlert({message: message, type: type});
        setTimeout(() => {
            setAlert(null);
        }, 2000);
    };

    return (
        <todoContext.Provider value={{
            setCookie,
            getCookie,
            eraseCookie,
            loginUser,
            SignUpUser,
            CreateTask,
            getListTasks,
            getListTasksByFilter,
            DeleteTask,
            UpdateTask,
            UpdateStatusTask,
            alert,
            listTasks,
            setListTasks,
            showAlert,
        }}>
            {props.children}
        </todoContext.Provider>
    );
};

export default TodoState;
