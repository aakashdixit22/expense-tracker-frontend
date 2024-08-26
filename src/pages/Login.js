import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/login.css";

const Login = () => {
  const img =
    "https://euromed-economists.org/wp-content/uploads/2018/01/moneyfinance-1.jpg";

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("https://expense-tracker-backend-u48t.onrender.com/users/login", values);
      setLoading(false);
      message.success("Login successful");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/"); // Navigate to home page after successful login
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="login-page" >
        {loading && <Spinner />}
        <div className="row-container">
          <div className="col-md-4">
            <img src={img} alt="login-img" width={"100%"} height="auto" />
          </div>

          <div className="col-md-4 login-form">
            <Form layout="vertical" onFinish={submitHandler}>
              <h1>Login form</h1>
              <Form.Item label="Email" name="email">
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Link to="/register" style={{ marginRight: "20px" }}>
                    Not a user? Click here to Register
                  </Link>
                  <button
                    className="btn"
                    type="submit"
                    style={{ paddingLeft: "20px" }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
