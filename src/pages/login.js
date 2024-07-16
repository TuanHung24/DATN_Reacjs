import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberPassword(true);
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    //const id = query.get('id');
    if (token) {
        localStorage.setItem('token', token);
        //localStorage.setItem('id', id);
        setToken(token);
        navigate('/');
    }
}, [location.search, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });

      const { data } = response;

      if (response.status === 200) {
        localStorage.setItem('token', data.access_token);

        if (rememberPassword) {
          localStorage.setItem('rememberPassword', 'true');
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('rememberPassword');
          localStorage.removeItem('email');
        }

        alert('Đăng nhập thành công');
        navigate('/');
      } else {
        console.error('Login failed:', data.error);
        toast.error('Đăng nhập thất bại!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {

        alert(error.response.data.error);
      } else {
        console.error('Đăng nhập không thành công:', error);
        alert('Đăng nhập không thành công!');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/auth/google';
  };

  const handleRememberPasswordChange = (e) => {
    setRememberPassword(e.target.checked);
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-6">
          <div className="card shadow-2-strong">
            <div className="card-body p-5 text-center">
              <h3 className="mb-5">Đăng nhập</h3>

              <div className="mb-4">
                <label className="form-label" htmlFor="typeEmailX-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="typeEmailX-2"
                  name="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="typePasswordX-2">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  name="password"
                  id="typePasswordX-2"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-check d-flex justify-content-between mb-3">
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberPassword"
                    checked={rememberPassword}
                    onChange={handleRememberPasswordChange}
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    Remember password
                  </label>
                </div>
                <NavLink className="quen-mat-khau" to="/forgot-password">
                  Quên mật khẩu
                </NavLink>
              </div>

              <button id='login'
                className="btn btn-primary btn-lg btn-block"
                type="button"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
              <br />

              <button className="btn btn-lg btn-block btn-danger" id="google" onClick={handleGoogleLogin}>
                <FontAwesomeIcon icon={faGoogle} /> Đăng nhập bằng Google
              </button>

              <button className="btn btn-lg btn-block btn-primary" id="facebook">
                <FontAwesomeIcon icon={faFacebook} /> Đăng nhập bằng Facebook
              </button>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
