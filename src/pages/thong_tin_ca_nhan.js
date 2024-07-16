import { useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from "react-router-dom";
import withAuth from './withAuth';
function ThongTinCaNhan() {
    const navigate = useNavigate();
    const [Email, setEmail] = useState(localStorage.getItem('email'));
    const [hoTen, setHoTen] = useState(localStorage.getItem('name'));
    const [dienThoai, setDienThoai] = useState(localStorage.getItem('phone'));
    const [diaChi, setDiaChi] = useState(localStorage.getItem('address'));

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    });


    const upDateInfo = async () => {
        if (!hoTen || !dienThoai || !diaChi) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        setErrors({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
        });
        const Id = localStorage.getItem('id');
        try {
            const duLieuGui = { id: Id, email: Email, name: hoTen, phone: dienThoai, address: diaChi };
            const response = await axios.post('http://127.0.0.1:8000/api/update-info', duLieuGui);
            if (response.status === 200) {
                const data = await response.data.data;

                localStorage.setItem('name', data.name)
                localStorage.setItem('phone', data.phone);
                localStorage.setItem('address', data.address);
                alert(response.data.message);
                navigate('/info');
            } else {
                const data = await response.data;
                console.error('Đăng ký thất bại:', data.error);
                if (data.errors) {
                    setErrors(prev => ({ ...prev, ...data.errors }));
                }
            }

        } catch (error) {
            setErrors(prev => ({ ...prev, ...errors }));
            console.error('Lỗi:', error);
            alert("Có lỗi xảy ra khi cập nhật thông tin.");
        }
    };
    return (
        <>
            <Header />
            <div className='info'>
                <div className="mb-3">
                    <h5 className="title-info">Thông tin cá nhân:</h5>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" className="form-control" id="email" value={Email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="ho_ten" className="form-label">Họ tên:</label>
                        <input type="text" className="form-control" id="ho-ten" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="dien_thoai" className="form-label">Điện thoại:</label>
                        <input type="number" className="form-control" id="dien-thoai" value={dienThoai} onChange={(e) => setDienThoai(e.target.value)} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="dia_chi" className="form-label">Địa chỉ:</label>
                        <input type="text" className="form-control" id="dia-chi" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />
                    </div>
                </div><br />
                <button className="btn btn-primary" onClick={upDateInfo}><FontAwesomeIcon icon={faSave} />Lưu thông tin</button>
            </div>
            <Footer />
        </>
    )
}
export default withAuth(ThongTinCaNhan);    