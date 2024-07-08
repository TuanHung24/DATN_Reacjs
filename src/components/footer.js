import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
function Footer() {
  return (
    <>
      

        <footer className="page-footer shadow">
          <div className="d-flex flex-column mx-auto">
            <div className="d-flex flex-wrap justify-content-between footer">
              <div className="contact-footer">
                {/* <a href="/#" className="d-flex align-items-center p-0 text-dark">
                  <img alt="logo" className="img-logo" src="../img/logo.png"/>
                </a> */}
              </div>
              <div className="contact-footer">
                <p className="h5 mb-4">Về chúng tôi</p>
                <ul className="p-0">
                  <li className="my-2">
                    <NavLink className="text-dark" to="/">Trang chủ</NavLink>
                  </li>
                  <li className="my-2">
                    <NavLink className="text-dark" to="/gioi-thieu">Giới thiệu</NavLink>
                  </li>
                  <li className="my-2">
                    <NavLink className="text-dark" to="/">Sản phẩm</NavLink>
                  </li>
                </ul>
              </div>
              <div className="contact-footer">
                {/* <p className="h5 mb-4">Help</p> */}
                <ul className="p-0 dh">
                <li className="my-2">
                    <a className="text-dark" href="/">Chính sách bảo hành</a>
                  </li>
                  <li className="my-2">
                    <a className="text-dark" href="/">Đặt hàng</a>
                  </li>
                  <li className="my-2">
                    <a className="text-dark" href="/">Hoàn trả hàng</a>
                  </li>
                  
                </ul>
              </div>
              <div className="contact-footer">
                <p className="h5 mb-4">Thông tin liên hệ</p>
                <ul className="p-0">
                  <li className="my-2">
                    <i className="text-dark" href="/"><FontAwesomeIcon icon={faPhone} color="#00a651" size="1x" className="mr-4"/>&nbsp;0987888999</i>
                  </li>
                  <li className="my-2">
                    <i className="text-dark" href="/"><FontAwesomeIcon icon={faEnvelope} color="#007bff" size="1x" className="mr-4"/>&nbsp;dienthoai@hk.com.vn</i>
                  </li>
                  <li className="my-2">
                    <i className="text-dark" href="/"><FontAwesomeIcon icon={faMapMarker} color="##dc3545" size="1x" className="mr-4"/>&nbsp;123 Nguyễn Thái Học, Quận 1, Hồ Chí Minh</i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      
    </>
  )
}

export default Footer;