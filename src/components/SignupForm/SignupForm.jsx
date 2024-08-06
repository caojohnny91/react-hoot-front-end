import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import SignupIcon from "../../assets/images/signup.svg";
import styles from "./SignupForm.module.css";

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState([""]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate("/");
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const { username, password, passwordConf } = formData;

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.container}>
      <section>
        <img src={SignupIcon} alt="An owl sitting on a sign" />
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <p>{message}</p>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="name" value={username} name="username" onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} name="password" onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="confirm">Confirm Password:</label>
            <input type="password" id="confirm" value={passwordConf} name="passwordConf" onChange={handleChange} />
          </div>
          <div>
            <button disabled={isFormInvalid()}>Sign Up</button>
            <Link to="/">
              <button>Cancel</button>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignupForm;
