import React, { useState } from 'react';
import { Form, Input, message } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Spinner from '../components/Spinner';
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate(); // Used for redirecting from one page to another page
  
  // Correct way to use useState
  const [loading, setLoading] = useState(false);

  // Form submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post('/users/register', values); // Posting the values to this URL
      message.success("Registration successful");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
//IF USER IS THERE THEN WE WILL BLOCK REGISTER PAGE

  return (
    <div className='register-page'>
      {loading && <Spinner />}

      <Form layout='vertical' className=' register-form' onFinish={submitHandler}>
        <h2>Register Form</h2>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type='email' />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>
        <div className='d-flex justify-content-between'>
          <Link to='/login'>Already Registered? Click here to login</Link>
          <button className='btn btn-primary' type="submit">Register</button>
        </div>
      </Form>
    </div>
  );
}

export default Register;
