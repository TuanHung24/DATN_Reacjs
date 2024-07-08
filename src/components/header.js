import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faShoppingBag, faUser,faSearch,faSignIn, faUserPlus, faSignOutAlt  } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import Products from "./products";
import Product from './product';

function Header() {
  const [name, setName] = useState(localStorage.getItem('name') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [listProduct, setListProduct] = useState([]); // Khởi tạo với mảng rỗng
  const [sumCart, setSumCart] = useState(0);
  const [sumOrder, setSumOrder] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    

    // axios.get(`http://127.0.0.1:8000/api/get-cart/${userId}`)
    //         .then(response => {
    //             const cartItems = response.data.data;
    //             setSumCart(cartItems.length);
    //         })
    //         .catch(error => {
    //             alert(error.response.data.message);
    //         });

    if (token) {
      setIsLoggedIn(true);
      axiosUserInfo(token);
    }
  }, []);

  const axiosUserInfo = async (token) => {
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/me',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setName(response.data[0].name);
        localStorage.setItem('id', response.data[0].id);
        localStorage.setItem('name', response.data[0].name);
        localStorage.setItem('phone', response.data[0].phone);
        localStorage.setItem('email', response.data[0].email);
        localStorage.setItem('address', response.data[0].address);
      })
      .catch(error => console.error('Error:', error));
  };

  const logout = () => {
    const token = localStorage.getItem('token');

    axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/logout',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        clearLocalStorage();
        alert(response.data.message);
        navigate('/login');
      })
      .catch(error => {
        console.error('Error:', error);
        clearLocalStorage();
        navigate('/login');
      });
  };

  const clearLocalStorage = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('address');
    localStorage.removeItem('username');
  };

  const handleSearch = () => {
    axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/search-products?search=${searchTerm}`
    })
      .then(response => {
        setListProduct(response.data.data);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <>
      <header className="p-3 text-white">
        <section className="header-fixed w-100">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid1">
              <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fas fa-bars"></i>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2">
                  <li>
                    <NavLink to="/" className="nav-link active white">Trang chủ</NavLink>
                  </li>
                  <li>
                    <NavLink to="/gioi-thieu" className="nav-link">Giới thiệu</NavLink>
                  </li>
                  <li>
                    <NavLink to="/tu-van" className="nav-link">Tư vấn</NavLink>
                  </li>
                </ul>
              </div>

              <div className="search">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control form-control-dark"
                    placeholder="Tìm kiếm..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRightWidth: 0, boxShadow: "none" }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = "none";

                    }}
                  />
                  <div className="input-group-append">
                    <button className="input-group-text bg-transparent border-0" onClick={handleSearch}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>
              </div>
              {/* <button className="btn btn-primary" onClick={handleSearch}>
                            Tìm kiếm
                        </button> */}
              <div className="login-out">
                {isLoggedIn ? (
                  <>
                    <FontAwesomeIcon icon={faUser} size="1x" className="ml-2" />&nbsp;
                    <span>Xin chào, <NavLink to="/info" className="info-name">{name}</NavLink></span>
                    <button className="logout" onClick={logout}> <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className='login-user'><FontAwesomeIcon icon={faSignIn} />{' '}Đăng nhập</NavLink>|
                    <NavLink to="/register" className='register-user'><FontAwesomeIcon icon={faUserPlus} />{' '}Đăng ký</NavLink>
                  </>
                )}
              </div>
              {isLoggedIn ? (
                <>
                  <div className="d-flex align-items-center">
                    <NavLink className="text-reset me-3" to="/cart">
                      <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4"/>
                      {sumCart > 0 && (
                        <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
                      )}
                    </NavLink>
                    <NavLink className="text-reset me-3" to='/order'>
                      <FontAwesomeIcon icon={faShoppingBag} size="2x" className="ml-2" />
                      {sumOrder > 0 && (
                        <span className="badge rounded-pill badge-notification bg-danger">{sumOrder}</span>
                      )}
                    </NavLink>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center">
                    <NavLink className="text-reset me-3" to="/cart">
                      <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4" />
                      {sumCart > 0 && (
                        <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
                      )}
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </nav>
        </section>
        <div className="header-placeholder"></div>
      </header>
    </>
  );
}

export default Header;
