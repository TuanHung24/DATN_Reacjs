import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function QuenMatKhau(){
    const [Email,setEmail]=useState("")
    const navigator=useNavigate()
    const handleForgotPassword = async ()=>{
        try {
           
            const response = await axios.post('http://127.0.0.1:8000/api/send-email/', {
              email: Email,
            });
      
            
            alert(response.data.message);
            navigator('/login')
          } catch (error) {
            
            alert('Đã xảy ra lỗi: ' + (error.response?.data?.message || 'Vui lòng thử lại sau.'));
          }
    }
    return (<>
        <div className="row justify-content-center">
    <div className="col-12 col-md-8 col-lg-6 col-xl-6">
        <div className="card shadow-2-strong">
            <div className="card-body p-5 text-center">
                <h3 className="mb-5">Quên mật khẩu</h3>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="forgotEmail">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="forgotEmail"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="Nhập địa chỉ email của bạn"
                        
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <NavLink to="/login" className="quen-mk-login">Đăng nhập</NavLink>{'   '}
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleForgotPassword}>
                    Gửi mật khẩu
                </button>

            </div>
        </div>
    </div>
</div>

    </>)
}
export default QuenMatKhau;