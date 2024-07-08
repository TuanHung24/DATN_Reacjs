import React, { useState, useEffect } from 'react';
import Header from "../components/header";
import Footer from "../components/footer";
import withAuth from './withAuth';
import { ToastContainer } from 'react-toastify';
import { NavLink } from "react-router-dom";
import axios from "axios";
import OrderStatusBar from "../components/order_status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar } from "@fortawesome/free-solid-svg-icons";
import numeral from 'numeral';
import { Modal, Button } from 'react-bootstrap';
import Loading from '../components/loading';
import PaginationOrder from '../components/pagination_order';

function DonHang() {

    const [statusOrders, setStatusOrders] = useState([]);
    const [ratings, setRatings] = useState({});
    const [comment, setComment] = useState({});
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
            setLoading(true)
            try {
                const userId = localStorage.getItem('id');
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://127.0.0.1:8000/api/status-invoice/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {

                    setStatusOrders(response.data.data);


                    setLoading(false)
                }
            } catch (error) {
                console.error("Có lỗi khi lấy trạng thái đơn hàng:", error);
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
        console.log(selectedCapacityId, selectedColorId)

        const data = {
            hoa_don_id: selectedOrderId,
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

                localStorage.setItem(`hasRated_${key}`, true);
                alert(response.data.message);
                setShowRatingModal(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
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

    const hoanTraHandler = async (orderId) => {
        const token = localStorage.getItem('token');

        try {

            const response = await axios.post('http://127.0.0.1:8000/api/refund-order', { orderId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const data = {
            hoa_don_id: selectedOrderId,
            product_id: selectedProductId,
            customer_id: userId,
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


                alert(response.data.message);
                setShowCommentModal(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
        }
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
                ordersToDisplay = statusOrders.filter(order => order.status === 3);
                break;
            case 'completed':
                ordersToDisplay = statusOrders.filter(order => order.status === 4);
                break;
            case 'returned':
                ordersToDisplay = statusOrders.filter(order => order.status === 6);
                break;
            default:
                ordersToDisplay = statusOrders;
                break;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentOrders = ordersToDisplay.slice(startIndex, startIndex + itemsPerPage);

        if (currentOrders && currentOrders.length > 0) {
            return (
                <>
                    {currentOrders.map((order, orderIndex) => (
                        <div className="don_hang" key={orderIndex}>
                            {order && (order.status >= 1 && order.status <= 4) && (
                                <OrderStatusBar currentStatus={order.status} />
                            )}
                            <table className="table">
                                <thead>
                                    <h5><span>Mã hóa đơn: {order.id}</span></h5>

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
                                            <td>
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
                                                    {DoiThanhTien(item.price * item.quantity)}đ
                                                </div>
                                                {order.status === 4 ? (

                                                    <div className='comment-star'>
                                                        <button className="btn btn-warning" onClick={() => {
                                                            setSelectedOrderId(order.id);
                                                            setSelectedColorId(item.color.id);
                                                            setSelectedCapacityId(item.capacity.id)
                                                            setSelectedProductId(item.product.id);
                                                            setShowRatingModal(true);
                                                        }}>
                                                            Đánh giá{ }
                                                        </button>
                                                        {' '}
                                                        <button className="btn btn-primary" onClick={() => {
                                                            setSelectedOrderId(order.id);
                                                            setSelectedColorId(item.color.id);
                                                            setSelectedCapacityId(item.capacity.id)
                                                            setSelectedProductId(item.product.id);
                                                            setShowCommentModal(true);
                                                        }}>
                                                            Bình luận
                                                        </button>
                                                    </div>
                                                ) : null}

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2"><strong>Địa chỉ giao hàng:</strong></td>
                                        <td colSpan="4">{order.address}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><strong>Phương thức thanh toán:</strong></td>
                                        <td colSpan="4">{order.payment_method}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><strong>Tổng tiền:</strong></td>
                                        <td colSpan="4" className='order-total'>{DoiThanhTien(order.total)}đ</td>
                                    </tr>
                                    {order.status === 6 && (
                                        <tr>
                                            <td colSpan="1">
                                                <strong>
                                                    Trạng thái:<span className="status-huy">Hoàn trả đơn</span>
                                                </strong>
                                            </td>

                                        </tr>
                                    )}
                                    {order.status === 5 && (
                                        <tr>
                                            <td colSpan="6">
                                                <strong>
                                                    Trạng thái:<span className="status-huy">Hủy đơn</span>
                                                </strong>
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
                                    <button className="btn btn-secondary" onClick={() => hoanTraHandler(order.id)}>
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
                    <Header />

                    <div className='invoice'>
                        <><h7 className='don-hang' ><NavLink to='/' className='menu'>Trang chủ</NavLink>{' | '}
                            <NavLink to='/order' className='menu'>đơn hàng</NavLink>

                            <div className="status-order">
                                <button onClick={All} className={`btn btn-light mr-2 ${currentFilter === 'all' ? 'active' : ''}`}>Tất cả</button>
                                <button onClick={DangGiao} className={`btn btn-light mr-2 ${currentFilter === 'pending' ? 'active' : ''}`}>Đang giao</button>
                                <button onClick={DaGiao} className={`btn btn-light mr-2 ${currentFilter === 'delivered' ? 'active' : ''}`}>Đã giao</button>
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
                </>
            )}
        </>
    );

}


export default withAuth(DonHang);
