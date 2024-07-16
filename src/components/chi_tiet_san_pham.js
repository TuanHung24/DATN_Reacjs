import Header from "./header";
import Footer from "./footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { debounce } from 'lodash';
import numeral from 'numeral';
import 'chart.js/auto';
import CommentSection from "./comment_section";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faStar, faGift, faShippingFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Product from "../components/product";
import StarRating from './star_rating';
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
function CTSanPham(props) {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [Count, setCount] = useState(1);
    const token = localStorage.getItem('token');
    const [raTe, setRate] = useState(props.data.rate);
    const [tonKho, setTonKho] = useState(0);
    const [selectedCapacity, setselectedCapacity] = useState(null);
    const [selectedCapacityId, setselectedCapacityID] = useState(null);
    const [selectedColor, setselectedColor] = useState(null);

    const [binhLuan, setBinhLuan] = useState([]);
    const [soSao, setSoSao] = useState([]);
    const [sumStar, setSumStar] = useState([]);
    const [giaBan, setGiaBan] = useState(0);
    const [currentPercent, setCurrentPercent] = useState();
    const [currentPrice, setCurrentPrice] = useState();
    const [colorGroups, setColorGroups] = useState([]);
    const [dateEnd, setDateEnd] = useState();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const colors = Object.keys(colorGroups);
    const images = colorGroups[colors[selectedColorIndex]] || [];

    useEffect(() => {
        const groupedImages = groupImagesByColor(props.data.img_product);
        setColorGroups(groupedImages);

        const fetchRelatedProducts = debounce(async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/brand/${props.data.brand_id}`);
                const data = await response.json();
                setRelatedProducts(data.data.product);
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        }, 300);

        fetchRelatedProducts();


        return () => {
            fetchRelatedProducts.cancel();
        };
    }, [props.data.brand_id, props.data.img_product]);


    const handleColorClick = (index) => {
        setSelectedColorIndex(index);

        const selectedColorId = colors[index];
        const imagesOfSelectedColor = colorGroups[selectedColorId];

        if (imagesOfSelectedColor && imagesOfSelectedColor.length > 0) {
            setSelectedImageIndex(0);
        }
    };

    const groupImagesByColor = (images) => {
        const groups = images.reduce((acc, img) => {
            if (!acc[img.color_id]) {
                acc[img.color_id] = [];
            }
            acc[img.color_id].push(img);
            return acc;
        }, {});
        return groups;
    };


    useEffect(() => {

        if (props.data.product_detail.length > 0) {

            const defaultDetail = props.data.product_detail[0];
            const defaultDungLuong = defaultDetail.capacity.name;
            const defaultDungLuongId = defaultDetail.capacity.id;
            const defaultMauSac = defaultDetail.color.name;
            const defaultTonKho = defaultDetail.quantity;
            const defaultGiaBan = defaultDetail.price;

            let defaultPercent = '';
            let defaultPrice = '';
            let defaultDateEnd = null;
            let discountPrice = null;

            if (defaultDetail.discount_detail.length > 0) {
                discountPrice = DoiThanhTien(defaultDetail.discount_detail[0].price);
                defaultPercent = defaultDetail.discount_detail[0].percent;
                defaultPrice = defaultDetail.discount_detail[0].price;
                defaultDateEnd = defaultDetail.discount_detail[0].discount.date_end;
            }


            setDateEnd(defaultDateEnd);
            setselectedCapacity(defaultDungLuong);
            setselectedColor(defaultMauSac);
            setTonKho(defaultTonKho);
            setGiaBan(defaultGiaBan)
            setCurrentPercent(defaultPercent)
            setCurrentPrice(defaultPrice)
            setselectedCapacityID(defaultDungLuongId);
        }
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

    }, [props.data.product_detail]);





    const DoiThanhTien = (soTien) => {

        const so = parseFloat(soTien);
        return numeral(so).format('0,0');
    }

    useEffect(() => {
        setBinhLuan(props.data?.comment);
        setSoSao(props.data?.rate.filter(rate => rate.capacity_id === selectedCapacityId));
    }, [props.data.comment]);


    const handleMauSacClick = (mauSac) => {
        setselectedColor(mauSac);

        const chiTietSanPhamSelected = props.data.product_detail.find(item => item.capacity.name === selectedCapacity && item.color.name === mauSac);

        if (chiTietSanPhamSelected) {
            setTonKho(chiTietSanPhamSelected.quantity);
            setCount(1);
            setGiaBan(chiTietSanPhamSelected.price);
            setDateEnd(chiTietSanPhamSelected.discount_detail?.discount?.date_end);
            setCurrentPrice(chiTietSanPhamSelected.discount_detail.length > 0 ? chiTietSanPhamSelected.discount_detail[0].price : null);
            setCurrentPercent(chiTietSanPhamSelected.discount_detail.length > 0 ? chiTietSanPhamSelected.discount_detail[0].percent : null);
        }
    };

    const calculateRemainingTime = (endDate) => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const distance = end - now;
        if (distance < 0) {
            return "Khuyến mãi đã kết thúc";
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        return `${days} ngày ${hours} giờ ${minutes} phút`;
    };
    const currentDiscountValid = new Date(dateEnd) > new Date();


    useEffect(() => {
        const danhGiaProps = props.data?.rate || [];
        setRate(danhGiaProps);
        tongSoSao1(selectedCapacityId);
    }, [props.data, selectedCapacityId]);

    const thongKeSoSao = () => {
        const thongKe = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        if (filteredRates && selectedCapacityId) {
            filteredRates.forEach((danhGiaItem) => {
                const star = Math.floor(danhGiaItem.star);
                if (star >= 1 && star <= 5 && danhGiaItem.capacity_id === selectedCapacityId) {
                    thongKe[star]++;
                }
            });
        }

        return thongKe;
    };



    const themVaoGioHandler = () => {
        const chiTietSanPhamSelected = props.data.product_detail.find(item =>
            item.capacity.name === selectedCapacity && item.color.name === selectedColor);

        if (!chiTietSanPhamSelected) {
            alert('Không tìm thấy chi tiết sản phẩm!');
            return;
        }

        const { quantity } = chiTietSanPhamSelected;

        if (quantity <= 0) {
            alert('Sản phẩm này hiện đã hết hàng!');
            return;
        }

        const addCart = {
            quantity: Count,
            product_id: chiTietSanPhamSelected.product_id,
            customer_id: localStorage.getItem('id'),
            capacity_id: chiTietSanPhamSelected.capacity.id,
            color_id: chiTietSanPhamSelected.color.id,
        };


        axios.post('http://127.0.0.1:8000/api/add-cart', {
            productData: addCart,
        })
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                alert(error.response.data.message);
            });

    }



    const renderThongKe = () => {
        const thongKe = thongKeSoSao();
        const soLuongDanhGia = Object.values(thongKe).reduce((acc, cur) => acc + cur, 0);
        const averageRating = soLuongDanhGia > 0 ? (sumStar / soLuongDanhGia).toFixed(1) : 0;

        return (
            <>
                <h3 className="danh-gia-chi-tiet">Đánh giá {props.data.name} - {selectedCapacity}</h3>
                {
                    soLuongDanhGia <= 0 ? (
                        <span className="so-luot-danh-gia"> Chưa có đánh giá nào!</span>
                    ) : (
                        <>
                            <span className="so-sao-sp">
                                <StarRating rating={averageRating} />
                            </span>
                            <span className="so-luot-danh-gia">{soLuongDanhGia} đánh giá</span>
                        </>
                    )
                }

                <ul className="ul-danh-gia">
                    {Object.keys(thongKe).reverse().map((sao) => (
                        <li key={sao} className="li-danh-gia">
                            {parseInt(sao, 10)} <FontAwesomeIcon style={{ color: 'orange' }} icon={faStar} />: {thongKe[sao]} người đánh giá
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    const chonMuaHandler = () => {

        const chiTietSanPhamSelected = props.data.product_detail.find(item =>
            item.capacity.name === selectedCapacity && item.color.name === selectedColor);

        if (!chiTietSanPhamSelected) {
            alert('Không tìm thấy chi tiết sản phẩm!');
            return;
        }

        const { quantity } = chiTietSanPhamSelected;

        if (quantity <= 0) {
            alert('Sản phẩm này hiện đã hết hàng!');
            return;
        }

        const addCart = {
            quantity: Count,
            product_id: chiTietSanPhamSelected.product_id,
            customer_id: localStorage.getItem('id'),
            capacity_id: chiTietSanPhamSelected.capacity.id,
            color_id: chiTietSanPhamSelected.color.id,
        };

        axios.post('http://127.0.0.1:8000/api/add-cart', {
            productData: addCart,
        })
            .then(response => {
                navigate('/thanh-toan')
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    };





    const HandelCong = () => {
        if (Count < tonKho) {
            setCount(Count + 1);
            return;
        }
        if (Count >= tonKho) {
            alert('Sản phẩm đã đạt số lượng tối đa');
            return;
        }
    };
    const HandelTru = () => {
        if (Count > 1) {
            setCount(Count - 1);
            return;
        }
    };



    const getUniqueDungLuongs = (chiTietSanPham) => {
        const unique = new Map();
        return chiTietSanPham.filter(item => {
            const isUnique = !unique.has(item.capacity.name);
            unique.set(item.capacity.name, true);
            return isUnique;
        });
    };

    const tongSoSao1 = (selectedCapacityId) => {
        let sum = 0;

        if (filteredRates && selectedCapacityId) {
            filteredRates.forEach((item) => {
                if (item.capacity_id === selectedCapacityId) {
                    sum += item.star;
                }
            });
        }

        setSumStar(sum);
    };
    const handleDungLuongClick = (dungLuong, dungLuongId) => {
        setselectedCapacity(dungLuong);
        setselectedCapacityID(dungLuongId)


        const mauSacCoSan = props.data.product_detail
            .filter(item => item.capacity.name === dungLuong)
            .map(item => item.color.name);


        if (mauSacCoSan.length > 0) {
            setselectedColor(mauSacCoSan[0]);
        } else {
            setselectedColor(null);
        }


        const chiTietSanPhamSelected = props.data.product_detail
            .find(item => item.capacity.name === dungLuong && item.color.name === mauSacCoSan[0]);

        if (chiTietSanPhamSelected) {
            setTonKho(chiTietSanPhamSelected.quantity);
            setCount(1);
            setGiaBan(chiTietSanPhamSelected.price)
            setDateEnd(chiTietSanPhamSelected.discount_detail.length > 0 ? chiTietSanPhamSelected.discount_detail[0].discount.date_end : null);
            setCurrentPrice(chiTietSanPhamSelected.discount_detail.length > 0 ? chiTietSanPhamSelected.discount_detail[0].price : null);
            setCurrentPercent(chiTietSanPhamSelected.discount_detail.length > 0 ? chiTietSanPhamSelected.discount_detail[0].percent : null);

        }
        tongSoSao1(dungLuongId);
    };



    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next) => setSelectedImageIndex(next),
    };


    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "blue" }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "green" }}
                onClick={onClick}
            />
        );
    }

    const filteredComments = binhLuan.filter(comment => comment.capacity_id === selectedCapacityId);
    const filteredRates = raTe.filter(rate => rate.capacity_id === selectedCapacityId);

    return (

        <>

            <Header />
            <p className="ct-name-sp">Điện thoại {props.data.name}{' '}{selectedCapacity} {' '}{ }</p>
            <div className="chi-tiet">

                <div className="hinhanhsp">

                    <div className="main-img">
                        <Slider {...sliderSettings}>
                            {images.length > 0 && images.map((image, index) => (
                                <img id="detail-main-img"
                                    key={index}
                                    src={`http://127.0.0.1:8000/${image.img_url}`}
                                    alt={`Hình chính ${index + 1}`}
                                />
                            ))}
                        </Slider>
                    </div>

                    <div id="item-name-color">
                        {colors.map((colorId, index) => (

                            <>
                                <div className="name-color-img">
                                    <img
                                        key={index}
                                        src={`http://127.0.0.1:8000/${colorGroups[colorId][0].img_url}`}
                                        alt={`Hình màu ${index + 1}`}
                                        className={index === selectedColorIndex ? 'detail-img-thumbnails active-name border-orange-500' : 'detail-img-thumbnails'}
                                        onClick={() => handleColorClick(index)}
                                    />
                                    <span >{props.data.product_detail.find(item => item.color.id == colorId)?.color.name}</span>
                                </div></>
                        ))}
                    </div>
                </div>


                <div className="info-product">
                    {getUniqueDungLuongs(props.data.product_detail).map((item) => (
                        <span
                            key={item.capacity.id}
                            className={`capacity ${selectedCapacity === item.capacity.name ? 'selected' : ''}`}
                            onClick={() => handleDungLuongClick(item.capacity.name, item.capacity.id)}
                        >
                            {item.capacity.name || ''}
                        </span>
                    ))}
                    <br /><br />

                    {props.data.product_detail
                        .filter(item => item.capacity.name === selectedCapacity)
                        .map((item) => (
                            <span
                                key={item.id}
                                className={`color ${selectedColor === item.color.name ? 'selected' : ''}`}
                                onClick={() => handleMauSacClick(item.color.name)}
                            >
                                {item.color.name || ''}
                            </span>
                        ))}
                    <br /><br />


                    <div className="discount-product">

                        {currentDiscountValid && currentPercent > 0 ? (
                            <>
                                <div className="name-discount">
                                    <FontAwesomeIcon style={{ color: 'red' }} icon={faGift} /> Khuyến mãi
                                    <p id="remaining">Kết thúc: {calculateRemainingTime(dateEnd)}</p>
                                </div>
                                <strong className='free-city'><FontAwesomeIcon icon={faShippingFast} className="icon" />
                                    <span className="free-text">FREE</span>: TP.Hồ Chí Minh</strong>
                                <div className='price-percent'>
                                    <span className="price-have-discount">{DoiThanhTien(giaBan)}₫</span> -{currentPercent}%
                                </div>
                                <div className="price-detail">{DoiThanhTien(currentPrice)}₫</div>

                            </>
                        ) : (
                            <>
                                <strong className='free-city'><FontAwesomeIcon icon={faShippingFast} className="icon" />
                                    <span className="free-text">FREE</span>: TP.Hồ Chí Minh</strong>
                                <div className="price-detail">{DoiThanhTien(giaBan)}₫</div></>
                        )}



                        <div className="quantity">
                            Số lượng:

                            <button className="tru-so-luong" onClick={HandelTru}>-</button>
                            <input type="number" className="input-so-luong" value={Count} readOnly />
                            <button className="cong-so-luong" onClick={HandelCong}>+</button>

                        </div>
                        <br />

                        {token ? (
                            <>
                                <button onClick={chonMuaHandler} className="btn btn-danger buy-now">Mua ngay</button>
                            </>
                        ) : (
                            <>
                                <button onClick={chonMuaHandler} className="btn btn-danger buy-now">Mua ngay</button>
                            </>
                        )
                        }

                        <button onClick={themVaoGioHandler} className="btn btn-primary add-cart">Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="policy">
                    <ul className="policy__list">
                        <li>
                            <div className="iconl">
                                <i className="icondetail-doimoi"></i>
                            </div>
                            <p>
                                Hư gì đổi nấy <b>12 tháng</b>  tại 3089 siêu thị toàn quốc (miễn phí tháng đầu) <a href="#"></a>
                                <a href="#" title="Chính sách đổi trả">
                                    Xem chi tiết
                                </a>
                            </p>
                        </li>
                        <li data-field="IsSameBHAndDT">
                            <div className="iconl">
                                <i className="icondetail-baohanh"></i>
                            </div>
                            <p>
                                Bảo hành <b>chính hãng điện thoại 1 năm</b> tại các trung tâm bảo hành hãng
                                <a href="#" target="_blank" title="Chính sách bảo hành">
                                    Xem địa chỉ bảo hành
                                </a>

                            </p>
                        </li>

                    </ul>
                </div>

                <div className="parameter">
                    <div className="danh-gia">
                        <div>{renderThongKe()}</div>
                    </div>
                    <div className="binh-luan col-md-8">
                        {filteredComments.length > 0 ? (
                            <CommentSection binhLuan={filteredComments} />
                        ) : (
                            <div className="comment-section">
                                <h5>Bình luận:</h5>
                                <p className="none-comment">Chưa có bình luận nào.</p>
                            </div>
                        )}
                    </div>

                    <ul className="parameter__list">
                        <h5>Thông tin sản phẩm:</h5>
                        <li className="productdetail_list">
                            <p className="lileft">Màn hình:</p>
                            <div className="liright">
                                <span className="">{props.data.product_description.screen.size}</span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Hệ điều hành:</p>
                            <div className="liright">
                                <span className="">{props.data.product_description.os}</span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Camera:</p>
                            <div className="liright">
                                <span className="">{props.data.product_description.front_camera.resolution}, {props.data.product_description.rear_camera.resolution} </span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">RAM:</p>
                            <div className="liright">
                                <span className="">{props.data.product_description.ram} GB</span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Dung lượng:</p>
                            <div className="liright">
                                <span className="">{selectedCapacity}</span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Pin:</p>
                            <div className="liright">
                                <span className="comma">{props.data.product_description.battery} mAh</span>

                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Trọng lượng:</p>
                            <div className="liright">
                                <span className="">{props.data.product_description.weight} g</span>
                            </div>
                        </li>
                        <li className="productdetail_list">
                            <p className="lileft">Hãng</p>
                            <div className="liright">
                                <span className="">{props.data.brand.name}</span>
                            </div>
                        </li>
                    </ul>



                    <button className="btn btn-outline-primary see-product-detail" onClick={handleShow}>
                        <span> Xem chi tiết cấu hình</span>
                    </button>




                </div>

            </div>
            <Modal show={show} onHide={handleClose} id="modal-confi-product" style={{ minWidth: '80%' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông số kỹ thuật</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="parameter-all">
                        <div className="parameter-item">
                            <p className="parameter-ttl">Màn hình</p>
                            <ul className="ulist">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Công nghệ màn hình:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.screen.technoscreen}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p >Độ phân giải:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.screen.resolution}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Màn hình rộng:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.screen.size}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Độ sáng tối đa:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.screen.brightness}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Camera sau</p>
                            <ul className="ulist ">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Độ phân giải:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.rear_camera.resolution}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Quay phim:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.rear_camera.record}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Đèn Flash:</p>
                                    </div>
                                    <div className="ctRight">
                                        {props.data.product_description.rear_camera.flash == 1 ? (
                                            <>
                                                <span>Có</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Không</span>
                                            </>
                                        )
                                        }

                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Tính năng:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.rear_camera.feature}</span>

                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Camera trước</p>
                            <ul className="ulist ">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Độ phân giải:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.front_camera.resolution}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Tính năng:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.front_camera.feature}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Hệ điều hành &amp; CPU</p>
                            <ul className="ulist ">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Hệ điều hành:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.os}</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Chip xử lý (CPU):</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.chip}</span>
                                    </div>
                                </li>

                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Bộ nhớ &amp; Lưu trữ</p>
                            <ul className="ulist">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>RAM:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.ram} GB</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Dung lượng lưu trữ:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{selectedCapacity}</span>
                                    </div>
                                </li>


                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Kết nối</p>
                            <ul className="ulist">

                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>SIM:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.sims}</span>
                                    </div>
                                </li>


                            </ul>
                        </div>
                        <div className="parameter-item">
                            <p className="parameter-ttl">Pin &amp; Khối lượng</p>
                            <ul className="ulist ">
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Dung lượng pin:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span className="">{props.data.product_description.battery} mAh</span>
                                    </div>
                                </li>
                                <li className="productdetail_list1">
                                    <div className="ctLeft">
                                        <p>Khối lượng:</p>
                                    </div>
                                    <div className="ctRight">
                                        <span>{props.data.product_description.weight} g</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="related-products">
                <h4>Sản phẩm liên quan</h4><br />
                <div className="related-products-detail">
                    {relatedProducts.map((product) => (
                        <Product key={product.id} member={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}
export default CTSanPham;


