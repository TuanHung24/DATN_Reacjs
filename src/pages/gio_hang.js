import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import numeral from 'numeral';
import axios from "axios";
import Loading from "../components/loading";

function GioHang() {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id');
        axios.get(`http://127.0.0.1:8000/api/get-cart/${userId}`)
            .then(response => {
                const cartItems = response.data.data;
                setCartItems(cartItems);

                setLoading(false)
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    }, []);

    if (!numeral.locales['vi-custom']) {
        numeral.register('locale', 'vi-custom', {
            delimiters: {
                thousands: '.',
                decimal: ',',
            },
            currency: {
                symbol: '',
            },
        });
    }
    numeral.locale('vi-custom');

    const DoiThanhTien = (soTien) => {
        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    };

    const thanhToanHandler = () => {
        if (!token) {
            alert('Vui lòng đăng nhập để thanh toán!')
            return;
        }
        const cartData = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            capacity_id: item.capacity_id,
            color_id: item.color_id,
            customer_id: localStorage.getItem('id'),
        }));

        axios.post('http://127.0.0.1:8000/api/update-cart', { cartData })
            .then(response => {
                navigate('/thanh-toan')
            })
            .catch(error => {
                alert(error.response.data.message);
            });

    };

    const timSoLuongTon = async (index) => {
        const updatedCartItems = [...cartItems];
        const item = updatedCartItems[index];

        if (item.quantity < 3) {
            item.quantity++;
            item.total = item.price * item.quantity;
            setCartItems(updatedCartItems);

        }

    };


    const giamSoLuongHandler = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].quantity > 1) {
            updatedCartItems[index].quantity--;
            updatedCartItems[index].total = updatedCartItems[index].price * updatedCartItems[index].quantity;
            setCartItems(updatedCartItems);

        }
        
    };
    
    const xoaHandler = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/delete-cart/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                
            });
            
            if (response.status === 200) {
                alert(response.data.message)
                window.location.reload();
            } else {
                console.error('Xóa không thành công!');
            }
        } catch (error) {
            console.error('Lỗi giỏ hàng:', error);
        }

        
    };

    const gioHangUI = () => {
        if (cartItems.length > 0) {
            return (
                <div className="giohang">
                    <h7><NavLink to='/' className='menu'>Trang chủ</NavLink>{' | '}<NavLink to='/cart' className='menu'>giỏ hàng</NavLink></h7>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider" id="table-gio-hang">
                            {
                                cartItems.map(function (item, index) {
                                    item.total = item.price * item.quantity;
                                    const percent = item.percent ? item.percent : 0;
                                    return (
                                        <tr key={item.id}>
                                            <td className="detail-product-cart">
                                                <NavLink to={`/product/${item.product_name}`} className='detail-product-cart'>
                                                    <img src={`http://127.0.0.1:8000/${item.img_product.img_url}`} alt="img-cart" className="img-cart" />
                                                    <span>
                                                        {'   '}{item.product_name}{' - '}{item.color}{' - '}{item.capacity}
                                                    </span>
                                                    {percent > 0 && (
                                                        <span className="discount-badge">Giảm giá {percent}% OFF</span>
                                                    )}
                                                </NavLink>
                                            </td>
                                            <td>{DoiThanhTien(item.price)}</td>
                                            <td>
                                                <button className="quantity-btn" onClick={() => giamSoLuongHandler(index)}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button className="quantity-btn" onClick={() => timSoLuongTon(index)} disabled={item.quantity >= 3}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </td>
                                            <td>{DoiThanhTien(item.total)}</td>
                                            <td className="cap-xoa">
                                                <button onClick={() => xoaHandler(item.id)} className="btn btn-outline-danger" id="delete-product-cart">X</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                    <button onClick={thanhToanHandler} className="btn btn-primary" id="thanh-toan">Thanh toán</button>
                </div>
            )
        }
        return <>
            <div className="giohang">
                <FontAwesomeIcon icon={faCartShopping} className="cart_shoping" />
                <p className="not_product">Giỏ hàng chưa có sản phẩm nào</p>
                <NavLink to="/" type="button" className="btn btn-primary th-ng">Thêm sản phẩm ngay</NavLink>
            </div>
        </>
    }
    return (
        <>
            <Header />
            {loading ? (
                <Loading />

            ) : (gioHangUI())}
            <Footer />
        </>
    )
}

export default GioHang;
