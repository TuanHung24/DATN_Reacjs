import { NavLink, useNavigate } from 'react-router-dom';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';

function DangKy() {

  const Name = useRef();
  const Email = useRef();
  const Password = useRef();
  const Phone = useRef();
  const Communes = useRef();
  const District = useRef();
  const Province = useRef();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleRegister = async () => {
    try {
      setErrors({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
      });

      const address = `${Communes.current.selectedOptions[0].text}, ${District.current.selectedOptions[0].text}, ${Province.current.selectedOptions[0].text}`;

      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        email: Email.current.value,
        password: Password.current.value,
        name: Name.current.value,
        phone: Phone.current.value,
        address: address
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        // const Dt = await response.data;
        // localStorage.setItem('token', Dt.access_token);
        alert(response.data.message);
        navigate('/login');
      } else {
        const data = await response.data;
        console.error('Đăng ký thất bại:', data.error);
        if (data.errors) {
          setErrors(prev => ({ ...prev, ...data.errors }));
        }
      }
    } catch (error) {
     
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(prev => ({ ...prev, ...error.response.data.errors }));
      }
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        } else {
          console.error('Lỗi khi lấy danh sách tỉnh thành: Dữ liệu không phải mảng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh thành:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
          if (Array.isArray(response.data.data)) {
            setDistricts(response.data.data);
          } else {
            console.error('Lỗi khi lấy danh sách quận huyện: Dữ liệu không phải mảng');
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách quận huyện:', error);
        }
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchCommunes = async () => {
      if (selectedDistrict) {
        try {
          const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
          if (Array.isArray(response.data.data)) {
            setCommunes(response.data.data);
          } else {
            console.error('Lỗi khi lấy danh sách phường xã: Dữ liệu không phải mảng');
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách phường xã:', error);
        }
      }
    };
    fetchCommunes();
  }, [selectedDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-7 col-xl-7">
            <div className="card">
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-5">Đăng ký tài khoản</h2>
                <form method='POST'>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example1cg">Họ tên:</label>
                    <input type="text" id="form3Example1cg" ref={Name} className="form-control form-control-lg" />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example2cg">Email:</label>
                    <input type="email" id="form3Example2cg" ref={Email} className="form-control form-control-lg" />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example5cdg">Mật khẩu:</label>
                    <input type="password" id="form3Example5cdg" ref={Password} className="form-control form-control-lg" />
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example4cg">Số điện thoại:</label>
                    <input type="number" id="form3Example4cg" ref={Phone} className="form-control form-control-lg" />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3cg">Địa chỉ:</label>
                    <div className='row'>
                      <div className="col-md-4">
                        <select className='form-select' ref={Province} onChange={handleProvinceChange}>
                          <option value="">Chọn tỉnh thành</option>
                          {provinces.map(province => (
                            <option key={province.id} value={province.id}>{province.full_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <select className='form-select' ref={District} onChange={handleDistrictChange}>
                          <option value="">Chọn quận/huyện</option>
                          {districts.map(district => (
                            <option key={district.id} value={district.id}>{district.full_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <select className='form-select' ref={Communes}>
                          <option>Chọn phường/xã</option>
                          {communes.map(commune => (
                            <option key={commune.id}>{commune.full_name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body" onClick={handleRegister}>Đăng ký</button>
                  </div>
                  <p className="text-center text-muted mt-5 mb-0">Bạn đã có tài khoản? <NavLink to="/login" className="fw-bold text-body"><u>Đăng nhập</u></NavLink></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DangKy;
