import React, { useContext, useEffect, useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import todoContext from "../context/todoContext";
import Alert from "../components/Alert";

const SignUp = () => {
    let navigateTo = useNavigate()
    const { SignUpUser, showAlert, alert } = useContext(todoContext)
    const [credentials, setCredentials] = useState({username: "", password: "", password_two: ""})

    const HandleonClick = (e) => { setCredentials({ ...credentials, [e.target.name]: e.target.value }) }
    useEffect(() => {
        // FetchAllRoles();
        //eslint-disable-next-line
    }, []);

    const resetForm = () => {
        document.getElementById("resetForm").reset();
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        console.log("credentials", credentials)
        const jsonResponse = await SignUpUser(credentials);
        if (jsonResponse.success) {
            navigateTo('/signin');
            showAlert(jsonResponse.detail, "success")
            
        }
    }
    return (
        <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'>
            <div className='mask gradient-custom-3'></div>
            <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                <MDBCardBody className='px-5'>
                    <h2 className="text-uppercase text-center mb-5">SignUp</h2>
                    <MDBInput wrapperClass='mb-4' name='username' onChange={HandleonClick} label='Username' size='lg' id='form1' type='text' />
                    <MDBInput wrapperClass='mb-4' name='email' onChange={HandleonClick} label='Email' size='lg' id='form2' type='email' />
                    <MDBInput wrapperClass='mb-4' name='password' onChange={HandleonClick} label='Password' size='lg' id='form3' type='password' />
                    <MDBInput wrapperClass='mb-4' name='password_two' onChange={HandleonClick} label='Repeat your password' size='lg' id='form4' type='password' />
                    <div className='d-flex flex-row justify-content-center mb-4'>
                        <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in Terms of service' />
                    </div>
                    <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmitForm}>Register</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default SignUp;