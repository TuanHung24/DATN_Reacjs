import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import withAuth from './withAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faCreditCard, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

function ThanhToan() {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Thanh toán khi nhận hàng'); // Default payment method
    const [ship, setShip] = useState('');

    const Name = useRef();
    const Phone = useRef();
    const noTe = useRef();
    const apartmentNumber = useRef();
    const provinces1 = useRef();
    const district1 = useRef();
    const commune1 = useRef();
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [tongTien, setTongTien] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const userId = localStorage.getItem('id');

        setName(localStorage.getItem('name') || '');
        setPhone(localStorage.getItem('phone') || '');
        setAddress(localStorage.getItem('address') || '');
        const savedApartmentNumber = localStorage.getItem(`apartmentNumber_${localStorage.getItem('id')}`);
        if (savedApartmentNumber) {
            apartmentNumber.current.value = savedApartmentNumber;
        }
        axios.get(`http://127.0.0.1:8000/api/get-cart/${userId}`)
            .then(response => {

                const cartItems = response.data.data;
                setCartItems(cartItems);
                setLoading(false)
                if (cartItems.length <= 0) {
                    navigate('/cart');
                }
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    }, []);


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

                        if (selectedProvince === '79') {
                            setShip(0);
                        } else {
                            setShip(25000);
                        }
                        let total = 0;
                        cartItems.forEach(item => {
                            total += item.price * item.quantity;
                        });
                        setTongTien(total + ship);
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


    useEffect(() => {
        if (address) {
            const addressParts = address.split(', ').map(part => part.trim());

            if (addressParts.length === 3) {
                const xa = addressParts[0];
                const huyen = addressParts[1];
                const tinh = addressParts[2];

                const province = provinces?.find(prov => prov?.full_name?.trim().toLowerCase() === tinh.toLowerCase());
                if (province) {
                    setSelectedProvince(province.id);
                }

                const district = districts?.find(dist => dist?.full_name?.trim().toLowerCase() === huyen.toLowerCase());
                if (district) {
                    setSelectedDistrict(district.id);
                }

                const commune = communes?.find(comm => comm?.full_name?.trim().toLowerCase() === xa.toLowerCase());
                if (commune) {
                    setSelectedCommune(commune.id);
                }
            } else {
                console.error('Invalid address format:', address);
            }
        }
    }, [address, provinces, districts, communes]);


    const handleProvinceChange = (e) => {

        setSelectedProvince(e.target.value);
        setSelectedDistrict('');
        setSelectedCommune('');

    };

    const handleAddressChange = (e) => {
        const selectedProvinceName = provinces.find(province => province.id === selectedProvince)?.full_name || '';
        const selectedDistrictName = districts.find(district => district.id === selectedDistrict)?.full_name || '';
        const selectedCommuneName = communes.find(commune => commune.id === selectedCommune)?.full_name || '';

        setAddress(`${selectedCommuneName}, ${selectedDistrictName}, ${selectedProvinceName}`);

    };
    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedCommune('');
    };

    const handleCommuneChange = (e) => {
        setSelectedCommune(e.target.value);
    };


    useEffect(() => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedCommune('');
    }, [address]);

    useEffect(() => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        setTongTien(total + ship);
    }, [cartItems]);




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

    const formatSoTien = (soTien) => {
        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    }
    // Inside ThanhToan component

    const testHandler = async () => {
        try {
            if (!selectedCommune || !selectedDistrict || !selectedProvince || !apartmentNumber.current.value) {
                alert("Vui lòng chọn đầy đủ thông tin!");
                return;
            }
            const token = localStorage.getItem('token');
            const jsonData = {
                hd: [
                    {
                        customer_id: localStorage.getItem('id'),
                        total: tongTien,
                        address: apartmentNumber.current.value + ', ' + commune1.current.selectedOptions[0].text + ', ' + district1.current.selectedOptions[0].text + ', ' + provinces1.current.selectedOptions[0].text,
                        phone: phone,
                        payment_method: paymentMethod,
                        note: noTe.current.value,
                        ship: ship,
                    }
                ],
                cthd: cartItems.map(item => ({
                    product_id: item.product_id,
                    color_id: item.color_id,
                    capacity_id: item.capacity_id,
                    quantity: item.quantity,
                    price: item.price,
                    into_money: item.thanh_tien
                })),
                language: 'vn',
                bankCode: 'NCB'
            };
            const savedApartmentNumber = localStorage.getItem(`apartmentNumber_${localStorage.getItem('id')}`);


            if (apartmentNumber.current.value !== savedApartmentNumber) {
                localStorage.setItem(`apartmentNumber_${localStorage.getItem('id')}`, apartmentNumber.current.value);
            }
            if (paymentMethod === 'Thanh toán VNPAY') {
                const response = await axios.post('http://127.0.0.1:8000/api/vnpay-payment', jsonData, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const vnpayUrl = response.data.vnpay_url;
                    toast.success('Đặt hàng thành công!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    window.location.href = vnpayUrl;
                } else {
                    toast.error('Đặt hàng thất bại!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            } else {

                const response = await axios.post('http://127.0.0.1:8000/api/new-invoice', jsonData, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    toast.success('Đặt hàng thành công!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    navigate('/order');
                } else {
                    toast.error('Đặt hàng thất bại!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }



    const thanhToanUI = () => {
        if (cartItems.length > 0) {
            return (
                <div className='thanhtoan'>
                    <h5>Thanh toán</h5>
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
                            {cartItems.map(item => {
                                item.thanh_tien = item.price * item.quantity;
                                return (
                                    <tr key={item.id}>
                                        <td scope="row">
                                            <img src={`http://127.0.0.1:8000/${item.img_product.img_url}`} alt="img-cart" className="img-cart" />
                                            {' '} {item.product_name}{' - '}{item.color}{' - '}{item.capacity}
                                        </td>
                                        <td>{formatSoTien(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatSoTien(item.thanh_tien)}</td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                    {ship === 0 ? (
                        <div className="free-shipping">
                            <FontAwesomeIcon icon={faShippingFast} className="icon" />
                            <h6 className='free-ship'>Miễn phí vận chuyển</h6>
                        </div>
                    ) : (
                        <h6 className='ship'>Phí vận chuyển: {formatSoTien(ship)}đ</h6>
                    )}

                    <h6 className='thanh_tien'>Tổng tiền: {formatSoTien(tongTien)}đ</h6>
                </div>
            );
        }
    }

    return (
        <>
            <Header />
            {loading ? (
                <Loading />

            ) : (thanhToanUI())}
            <div className='thong-tin'>
                <div className="mb-3">
                    <h5>Thông tin người nhận hàng:</h5>

                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label">Họ tên:</label>
                        <input type="text" className="form-control" id="name" ref={Name} value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="phone" className="form-label">Điện thoại:</label>
                        <input type="number" className="form-control" id="phone" ref={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <label htmlFor="address" className="form-label">Địa chỉ:</label>
                    <div className="col-md-4">
                        <select className='form-select' value={selectedProvince} ref={provinces1} onChange={handleProvinceChange} onClick={handleAddressChange} >
                            <option value="">Chọn tỉnh thành</option>
                            {provinces.map(province => (
                                <option key={province.id} value={province.id}>{province.full_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className='form-select' value={selectedDistrict} ref={district1} onChange={handleDistrictChange}>
                            <option value="">Chọn quận/huyện</option>
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>{district.full_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className='form-select' value={selectedCommune} ref={commune1} onChange={handleCommuneChange}>
                            <option value="">Chọn phường/xã</option>
                            {communes.map(commune => (
                                <option key={commune.id} value={commune.id}>{commune.full_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='row'>
                    <div className="col-md-6">
                        <label htmlFor='apartment-number' className="form-label">Số nhà:</label>
                        <input type='text' className='form-control' id='apartment-number' ref={apartmentNumber} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="ghi-chu" className="form-label">Ghi chú:</label>
                        <input type="text" className="form-control" id="ghi-chu" ref={noTe} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <span>Phương thức thanh toán:</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="paymentMethod" id="paymentMethod1" value="Thanh toán khi nhận hàng" defaultChecked onChange={() => setPaymentMethod('Thanh toán khi nhận hàng')} />
                            <label className="form-check-label" htmlFor="paymentMethod1" id="title-COD">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="icon" />
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="paymentMethod" id="paymentMethod2" value="Thanh toán VNPAY" onChange={() => setPaymentMethod('Thanh toán VNPAY')} />
                            <label className="form-check-label" htmlFor="paymentMethod2" id="title-VNPAY">
                                <FontAwesomeIcon icon={faCreditCard} color='' />
                                Thanh toán VNPAY
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <button className="btn btn-warning" onClick={testHandler}>ĐẶT HÀNG</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default withAuth(ThanhToan);
