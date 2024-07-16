import axios from "axios";
import { useState } from "react";
import withAuth from './withAuth';
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave    } from '@fortawesome/free-solid-svg-icons';
function DoiMatKhau(){
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const navigate= useNavigate()
    const changePassword = async () => {
        if (!oldPassword || !newPassword || !newPassword1) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (newPassword !== newPassword1) {
            alert("Mật khẩu mới và xác nhận mật khẩu mới không khớp.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const Email = localStorage.getItem('email');

            const data = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                email: Email
            };

            const response = await axios.post('http://127.0.0.1:8000/api/reset-password', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert(response.data.message);

            setOldPassword("");
            setNewPassword("");
            setNewPassword1("");
            navigate('/info')

        } catch (error) {
            
            alert("Có lỗi xảy ra khi đổi mật khẩu.");
        }
    };


    return (
        <>
        <Header/>
       
         <div className="doi-mat-khau">
                <h5 className="title-reset-password">Thay đổi mật khẩu</h5>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="old-password" className="form-label">Mật khẩu cũ:</label>
                        <input type="password" className="form-control" id="old-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6" >
                        <label htmlFor="new-password" className="form-label">Mật khẩu mới:</label>
                        <input type="password" className="form-control" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="new-password1" className="form-label">Nhập lại mật khẩu mới:</label>
                        <input type="password" className="form-control" id="new-password1" value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} />
                    </div>
                </div><br />
                <button className="btn btn-primary" onClick={changePassword}><FontAwesomeIcon icon={faSave } />Lưu mật khẩu</button>
            </div>
            <Footer/>
        </>
    )
}

export default withAuth(DoiMatKhau);