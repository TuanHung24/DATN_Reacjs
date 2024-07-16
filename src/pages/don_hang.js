import React, { useState, useEffect } from 'react';
import Header from "../components/header";
import Footer from "../components/footer";
import withAuth from './withAuth';
import { ToastContainer } from 'react-toastify';
import { NavLink } from "react-router-dom";
import axios from "axios";
import OrderStatusBar from "../components/order_status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faShippingFast } from "@fortawesome/free-solid-svg-icons";
import numeral from 'numeral';
import { Modal, Button } from 'react-bootstrap';
import Loading from '../components/loading';
import PaginationOrder from '../components/pagination_order';

function DonHang() {
    const [showModalReturn, setShowModalReturn] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [sumCart, setSumCart] = useState(0);
    const [sumOrder, setSumOrder] = useState(0);
    const [statusOrders, setStatusOrders] = useState([]);
    const [ratings, setRatings] = useState({});
    const [comment, setComment] = useState({});
    const [commentReturn, setCommentReturn] = useState('');
    const [hasRated, setHasRated] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState('all');
    const itemsPerPage = 2;




    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [selectedCapacityId, setSelectedCapacityId] = useState(null);
    useEffect(() => {
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

        const fetchOrderStatus = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('id');
                const token = localStorage.getItem('token');


                const [cartResponse, statusResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/get-cart/${userId}`),
                    axios.post(`http://127.0.0.1:8000/api/status-invoice/${userId}`, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);
               

                const cartItems = cartResponse.data.data;
                const statusOrders = statusResponse.data.data;


                setSumCart(cartItems.length);
                setStatusOrders(statusOrders);
                setSumOrder(statusOrders.length);

            } catch (error) {
                console.error("Có lỗi khi lấy thông tin đơn hàng:", error);
                
            } finally {
                setLoading(false);
            }
        };


        fetchOrderStatus();

    }, []);

    const DoiThanhTien = (soTien) => {
        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    }

    const handleRatingChange = (newRating) => {
        setRatings(prevRatings => ({ ...prevRatings, [`${selectedOrderId}_${selectedProductId}`]: newRating }));
    };

    const handleRatingSubmit = async () => {
        const key = `${selectedOrderId}_${selectedProductId}`;
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');


        const data = {
            invoice_id: selectedOrderId,
            product_id: selectedProductId,
            customer_id: userId,
            star: ratings[key],
            color_id: selectedColorId,
            capacity_id: selectedCapacityId
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/evaluate', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setHasRated(prevState => ({
                    ...prevState,
                    [key]: true
                }));

                localStorage.setItem(`hasRated_${selectedOrderId}_${selectedProductId}_${selectedColorId}_${selectedCapacityId}`, true);
                alert(response.data.message);
                setShowRatingModal(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Sản phẩm đã được đánh giá!");
            } else {
                alert("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.");
            }
        }
    };

    const huyDonHandler = async (orderId) => {
        const token = localStorage.getItem('token');
        try {

            const response = await axios.post('http://127.0.0.1:8000/api/status-cancel', { orderId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert(response.data.message);
                window.location.reload();
            } else {

                console.error('Lỗi khi hủy đơn:', response.data);
            }

        } catch (error) {
            console.error('Có lỗi xảy ra khi hủy đơn hàng:', error);
        }
    };

    const handelReturn = (orderId) => {
        setSelectedOrderId(orderId)
        setShowModalReturn(true);
    };
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);


            const reader = new FileReader();
            reader.onload = (event) => {
                setImageUrl(event.target.result);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleClose = () => {
        setShowModalReturn(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (image == null || returnReason == null) {
            alert("Vui lòng chọn đầy đủ thông tin!")
            return;
        }

        const formData = new FormData();
        formData.append('order_id', selectedOrderId);
        formData.append('reason', returnReason);
        formData.append('customer_id', userId);
        if (commentReturn) {
            formData.append('comment', commentReturn);
        }
        formData.append('img_url', image);

        try {

            const response = await axios.post('http://127.0.0.1:8000/api/refund-order', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert(response.data.message);
                window.location.reload();
            } else {

                console.error('Lỗi khi hoàn trả đơn:', response.data);
            }

        } catch (error) {
            console.error('Có lỗi xảy ra khi hoàn trả đơn hàng:', error);
        }
    };


    const handleCommentChange = (newComment) => {
        setComment(prevComments => ({ ...prevComments, [`${selectedOrderId}_${selectedProductId}`]: newComment }));
    };

    const handleCommentSubmit = async () => {
        const key = `${selectedOrderId}_${selectedProductId}`;

        const token = localStorage.getItem('token');

        const data = {
            invoice_id: selectedOrderId,
            product_id: selectedProductId,

            content: comment[key],
            color_id: selectedColorId,
            capacity_id: selectedCapacityId
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/comment', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {

                localStorage.setItem(`hasComment_${selectedOrderId}_${selectedProductId}_${selectedColorId}_${selectedCapacityId}`, true);
                alert(response.data.message);
                
                setShowCommentModal(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Sản phẩm đã được đánh giá!");
            } else {
                alert("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.");
            }
        }
    };
    
    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('vi-VN', options);
        return formatter.format(date);
    };

    const renderStars = () => {
        const key = `${selectedOrderId}_${selectedProductId}`;
        const rating = ratings[key] || 0;

        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`star ${i <= rating ? 'selected' : ''}`}
                    onClick={() => handleRatingChange(i)}
                />
            );
        }
        return stars;
    };
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const All = () => {
        setCurrentFilter('all');
        setCurrentPage(1);
    };

    const DangGiao = () => {
        setCurrentFilter('delivering');
        setCurrentPage(1);
    };

    const DaGiao = () => {
        setCurrentFilter('completed');
        setCurrentPage(1);
    };

    const TraHang = () => {
        setCurrentFilter('returned');
        setCurrentPage(1);
    };
    const gioHangUI = () => {

        let ordersToDisplay = statusOrders;

        switch (currentFilter) {
            case 'delivering':
                ordersToDisplay = statusOrders?.filter(order => order.status === 3);
                break;
            case 'completed':
                ordersToDisplay = statusOrders?.filter(order => order.status === 4);
                break;
            case 'returned':
                ordersToDisplay = statusOrders?.filter(order => order.status === 6);
                break;
            default:
                ordersToDisplay = statusOrders;
                break;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentOrders = ordersToDisplay?.slice(startIndex, startIndex + itemsPerPage);
        
        if (currentOrders && currentOrders.length > 0) {
            return (
                <>

                    {currentOrders.map((order, orderIndex) => (

                        <div className="don_hang" key={orderIndex}>
                            {order && (order.status >= 1 && order.status <= 4) && (
                                <OrderStatusBar currentStatus={order.status} />
                            )}
                            <div className='invoice-id-time'>
                                <h5><span>Mã hóa đơn: {order.id} </span></h5>
                                <span className="order-time">{formatDate(order.date)}</span>
                            </div>
                            <table className="table">
                                <thead>

                                    <tr>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Đơn giá</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {order.invoice_detail.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td className='product-order'>
                                                <NavLink to={`/product/${item.product.name}`} className='detail-product-cart'>
                                                    {item.product.img_product.find(img => img.product_id === item.product.id && img.color_id === item.color.id) ? (
                                                        <img
                                                            src={`http://127.0.0.1:8000/${item.product.img_product.find(img => img.product_id === item.product.id && img.color_id === item.color.id).img_url}`}
                                                            className="img-order"
                                                            alt={`${item.product.name}`}
                                                        />
                                                    ) : (
                                                        <span>No image found</span>
                                                    )}
                                                    {item.product.name} {' '} {item.color.name} {' '} {item.capacity.name}
                                                </NavLink>
                                            </td>
                                            <td className='centered'>{DoiThanhTien(item.price)}</td>
                                            <td className='centered'>{item.quantity}</td>
                                            <td className='centered'>
                                                <div>
                                                    {DoiThanhTien(item.price * item.quantity)}₫
                                                </div>
                                                <div className='comment-star'>
                                                    {order.status === 4 && !localStorage.getItem(`hasRated_${order.id}_${item.product.id}_${item.color.id}_${item.capacity.id}`) ? (
                                                        <button className="btn btn-warning" onClick={() => {
                                                            setSelectedOrderId(order.id);
                                                            setSelectedColorId(item.color.id);
                                                            setSelectedCapacityId(item.capacity.id);
                                                            setSelectedProductId(item.product.id);
                                                            setShowRatingModal(true);
                                                        }}>
                                                            Đánh giá
                                                        </button>
                                                    ) : null}
                                                    {' '}
                                                    {order.status === 4 && !localStorage.getItem(`hasComment_${order.id}_${item.product.id}_${item.color.id}_${item.capacity.id}`) ? (
                                                        <button className="btn btn-primary" onClick={() => {
                                                            setSelectedOrderId(order.id);
                                                            setSelectedColorId(item.color.id);
                                                            setSelectedCapacityId(item.capacity.id);
                                                            setSelectedProductId(item.product.id);
                                                            setShowCommentModal(true);
                                                        }}>
                                                            Bình luận
                                                        </button>
                                                    ) : null}
                                                </div>

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="1"><strong>Địa chỉ giao hàng:</strong></td>
                                        <td colSpan="5">{order.address}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="1"><strong>Phương thức thanh toán:</strong></td>
                                        <td colSpan="5">{order.payment_method}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="1"><strong>Phí vận chuyển:</strong></td>
                                        {order.ship == 0 ? (
                                            <>
                                                <td colSpan="5">
                                                    <div className="free-shipping-order">
                                                        <FontAwesomeIcon icon={faShippingFast} className="icon" />
                                                        <h6 className='free-ship'>Miễn phí vận chuyển</h6>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td colSpan="5">{DoiThanhTien(order.ship)}₫</td>
                                            </>
                                        )

                                        }

                                    </tr>
                                    <tr>
                                        <td colSpan="1"><strong>Tổng tiền:</strong></td>
                                        <td colSpan="5" className='order-total'>{DoiThanhTien(order.total)}₫</td>
                                    </tr>
                                    {order.status === 6 && (
                                        <tr>
                                            <td colSpan="1">
                                                <strong>
                                                    Trạng thái:
                                                </strong>
                                            </td>
                                            <td colSpan="5">
                                                <span className="status-huy">Hoàn trả đơn</span>
                                            </td>
                                        </tr>
                                    )}
                                    {order.status === 5 && (
                                        <tr>
                                            <td colSpan="1">
                                                <strong>
                                                    Trạng thái:
                                                </strong>
                                            </td>
                                            <td colSpan="5">
                                                <span className="status-huy">Hủy đơn</span>
                                            </td>
                                        </tr>
                                    )}
                                </tfoot>
                            </table>
                            <div>
                                {order.status === 1 && (
                                    <button className="btn btn-danger" onClick={() => huyDonHandler(order.id)}>
                                        Hủy đơn
                                    </button>
                                )}
                                {order.status === 4 && (
                                    <button className="btn btn-secondary" onClick={() => handelReturn(order.id)}>
                                        Hoàn trả
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                    <PaginationOrder
                        itemsPerPage={itemsPerPage}
                        totalItems={ordersToDisplay.length}
                        currentPage={currentPage}
                        paginate={handlePageChange}
                    />
                </>
            );
        } else {
            return (
                <div className="giohang">
                    <FontAwesomeIcon icon={faShoppingBag} className="icon_shoping_bag" />
                    <p className="not_product">Không có đơn hàng nào!</p>
                    <NavLink to="/" className="btn btn-primary th-ng" type="button">Thêm sản phẩm ngay</NavLink>
                </div>
            )
        }
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <ToastContainer />
                    <Header order={sumOrder} cart={sumCart} />

                    <div className='invoice'>
                        <><h7 className='don-hang' ><NavLink to='/' className='menu'>Trang chủ</NavLink>{' | '}
                            <NavLink to='/order' className='menu'>đơn hàng</NavLink>

                            <div className="status-order">
                                <button onClick={All} className={`btn btn-light mr-2 ${currentFilter === 'all' ? 'active' : ''}`}>Tất cả</button>
                                <button onClick={DangGiao} className={`btn btn-light mr-2 ${currentFilter === 'delivering' ? 'active' : ''}`}>Đang giao</button>
                                <button onClick={DaGiao} className={`btn btn-light mr-2 ${currentFilter === 'completed' ? 'active' : ''}`}>Đã giao</button>
                                <button onClick={TraHang} className={`btn btn-light ${currentFilter === 'returned' ? 'active' : ''}`}>Hoàn trả</button>
                            </div>
                        </h7></>

                        {loading ? (
                            <Loading />

                        ) : (gioHangUI())}
                    </div>
                    <Footer />

                    <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="stars">
                                {renderStars()}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" onClick={handleRatingSubmit}>
                                Gửi đánh giá
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Bình luận về sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea
                                value={comment[`${selectedOrderId}_${selectedProductId}`] || ''}
                                onChange={(e) => handleCommentChange(e.target.value)}
                                placeholder="Viết bình luận của bạn ở đây..."
                                rows="4"
                                style={{ width: '100%' }}
                            ></textarea>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" onClick={handleCommentSubmit}>
                                Gửi bình luận
                            </Button>
                        </Modal.Footer>
                    </Modal>



                    <Modal show={showModalReturn} onHide={handleClose}>
                        <Modal.Header closeButton style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <Modal.Title>Hoàn trả đơn hàng: {selectedOrderId}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ padding: '15px', lineHeight: "50px" }}>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Lý do hoàn đơn:</label>
                                    <select
                                        className="form-control"
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Chọn lý do</option>
                                        <option value="Hàng bể vỡ (vỡ vụn, trầy xước, không nguyên vẹn, rò rỉ chất lỏng...)">Hàng bể vỡ (vỡ vụn, trầy xước, không nguyên vẹn, rò rỉ chất lỏng...)</option>
                                        <option value="Chưa nhận được hàng">Chưa nhận được hàng</option>
                                        <option value="Thiếu hàng">Thiếu hàng</option>
                                        <option value="Người bán gửi sai hàng">Người bán gửi sai hàng</option>
                                        <option value="Hàng lỗi, không hoạt động">Hàng lỗi, không hoạt động</option>
                                        <option value="Lý do khác">Lý do khác</option>
                                    </select>
                                </div>
                                {returnReason === 'Lý do khác' && (
                                    <div className="form-group">
                                        <label>Lý do trả hàng:</label>
                                        <textarea
                                            className="form-control"
                                            onChange={(e) => setCommentReturn(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Chọn ảnh:</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required
                                    />
                                </div>
                                {imageUrl && (
                                    <div className="form-group">
                                        <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '5px' }} />
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary">Hoàn trả</button>
                            </form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );

}


export default withAuth(DonHang);
