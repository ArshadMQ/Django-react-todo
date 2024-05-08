import React, { useState, useContext } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import todoContext from "../context/todoContext"
import Main_Component from './Main_Component';
import { useNavigate } from 'react-router-dom';


const SignIn = () => {
    const context = useContext(todoContext)
    let navigateTo = useNavigate()
    const { getCookie, loginUser, showAlert, FetchUserDetail } = context
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const HandleonClick = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const jsonResponse = await loginUser(credentials);
        console.log("jsonResponse", jsonResponse)
        if (jsonResponse.status === 401) {
            alert(jsonResponse.detail)
        }
        if (jsonResponse.success) {
            navigateTo('/');
            showAlert(jsonResponse.detail, "success")
        }
    }
    return (
        <>
            {!getCookie("access_token") ?
                <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'>
                    <div className='mask gradient-custom-3'></div>
                    <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                        <MDBCardBody className='px-5'>
                            <h2 className="text-uppercase text-center mb-5">SignIn</h2>
                            <MDBInput wrapperClass='mb-4' label='Username' name="username" onChange={HandleonClick} size='lg' id='form1' type='text' />
                            <MDBInput wrapperClass='mb-4' label='Password' name="password" onChange={HandleonClick} size='lg' id='form2' type='password' />
                            <MDBBtn className='mb-4 w-100' onClick={handleSubmitForm}>Login</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer> : <Main_Component />}
        </>
    );
}

export default SignIn;