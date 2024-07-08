
import Footer from "../components/footer";
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import axios from "axios";
import ListBanner from "./list_banner";
import Product from "../components/product";
import PaginationProduct from "../components/pagination_product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faHome } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { faCartShopping, faShoppingBag, faUser, faSearch, faSignOutAlt, faSignIn, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from "react-router-dom";
import News from "../components/news";
import Loading from "../components/loading";

function Trangchu() {
    //const moment = require('moment-timezone');
    const [name, setName] = useState(localStorage.getItem('name') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sumCart, setSumCart] = useState(0);
    const [sumOrder, setSumOrder] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isHome, setIsHome] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        axios.get(`http://127.0.0.1:8000/api/get-cart/${userId}`)
        .then(response => {
            const cartItems = response.data.data;
            setSumCart(cartItems.length);
        })
        .catch(error => {
            alert(error.response.data.message);
        });


        if (token) {
            setIsLoggedIn(true);
            axiosUserInfo(token);
        }
    }, []);
    
    const axiosUserInfo = async (token) => {
        axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/me',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setName(response.data[0].name);
                localStorage.setItem('id', response.data[0].id);
                localStorage.setItem('name', response.data[0].name);
                localStorage.setItem('phone', response.data[0].phone);
                localStorage.setItem('email', response.data[0].email);
                localStorage.setItem('address', response.data[0].address);
            })
            .catch(error => console.error('Error:', error));
    };

    const logout = () => {
        const token = localStorage.getItem('token');

        axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/logout',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                clearLocalStorage();
                alert(response.data.message);
                navigate('/login');
            })
            .catch(error => {
                console.error('Error:', error);
                clearLocalStorage();
                navigate('/login');
            });
    };

    const clearLocalStorage = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('address');

    };

    const handleSearch = () => {
        setIsHome(false);
        if (searchTerm.trim() === "") {
            fetchAllProducts();
        } else {
            axios({
                method: 'GET',
                url: `http://127.0.0.1:8000/api/search-products?search=${searchTerm}`
            })
                .then(response => {
                    setListProduct(response.data.data);
                    setNoResults(response.data.data.length === 0);
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const handleHomeClick = () => {
        setIsHome(true);
        fetchAllProducts();
    };


    const location = useLocation();

    const queryParams = queryString.parse(location.search);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    const [listBrand, setListBrand] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [priceRange, setPriceRange] = useState(queryParams.price || "");
    const [selectedProductTypeId, setSelectedProductTypeId] = useState(queryParams.productType || "Hãng");
    const [noResults, setNoResults] = useState(false);
    const [listRam, setListRam] = useState([]);
    const [selectedRam, setSelectedRam] = useState(queryParams.ram || "RAM");
    const [listStorage, setListStorage] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState(queryParams.storage || "Dung lượng lưu trữ");
    const [listBattery, setListBattery] = useState([]);
    const [selectedBattery, setSelectedBattery] = useState(queryParams.battery || "Pin");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseBrand = await axios.get('http://127.0.0.1:8000/api/brand');
                setListBrand(responseBrand.data.data);
            } catch (error) {
                console.error('Error fetching brands:', error.response ? error.response.data : error.message);
            }
        }
        fetchData();
    }, []);


    const fetchAllProducts = () => {
        setLoading(true);
        axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/product'
        })
            .then(response => {
                const products = response.data.data;

                const ramOptions = [...new Set(products.map(item => item.product_description?.ram))];
                ramOptions.sort((a, b) => parseInt(a) - parseInt(b));
                setListRam(ramOptions);

                const storageOptions = [...new Set(products.map(item => item.product_detail[0]?.capacity.name))];
                storageOptions.sort((a, b) => parseInt(a) - parseInt(b));
                setListStorage(storageOptions);

                const batteryOptions = [...new Set(products.map(item => item.product_description?.battery))];
                batteryOptions.sort((a, b) => parseInt(a) - parseInt(b));
                setListBattery(batteryOptions);

                setListProduct(products);
                setLoading(false);
                setNoResults(products.length === 0);
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    useEffect(() => {


        const fetchData = async () => {
            try {
                const responseProduct = await axios.get('http://127.0.0.1:8000/api/product');
                const products = responseProduct.data.data;

                const ramOptions = [...new Set(products.map(item => item.product_description?.ram))];
                ramOptions.sort((a, b) => parseInt(a) - parseInt(b)); // Sắp xếp RAM từ thấp đến cao
                setListRam(ramOptions);

                const storageOptions = [...new Set(products.map(item => item.product_detail[0]?.capacity.name))];
                storageOptions.sort((a, b) => parseInt(a) - parseInt(b)); // Sắp xếp dung lượng từ thấp đến cao
                setListStorage(storageOptions);

                const batteryOptions = [...new Set(products.map(item => item.product_description?.battery))];
                batteryOptions.sort((a, b) => parseInt(a) - parseInt(b)); // Sắp xếp pin từ thấp đến cao
                setListBattery(batteryOptions);

                let filteredProducts = [...products];

                if (queryParams.price) {
                    const [minPrice, maxPrice] = queryParams.price.split("-").map(Number);
                    filteredProducts = filteredProducts.flatMap(item => {
                        const filteredDetails = item.product_detail.filter(detail => {
                            const price = parseInt(detail.price, 10);
                            return price >= minPrice && price <= maxPrice;
                        });
                        return filteredDetails.length > 0 ? [{ ...item, product_detail: filteredDetails }] : [];
                    });
                }


                if (queryParams.brand) {
                    filteredProducts = filteredProducts.filter(item =>
                        item.brand.name?.toString().toLowerCase() === queryParams.brand.toLowerCase()
                    );
                }

                if (queryParams.ram && queryParams.ram !== "Tất cả") {
                    filteredProducts = filteredProducts.filter(item =>
                        item.product_description.ram === queryParams.ram
                    );
                }

                if (queryParams.storage && queryParams.storage !== "Tất cả") {
                    filteredProducts = filteredProducts.flatMap(item => {
                        const filteredVariants = item.product_detail.filter(detail => detail.capacity.name === queryParams.storage);
                        return filteredVariants.length > 0 ? [{ ...item, product_detail: filteredVariants }] : [];
                    });
                }

                if (queryParams.battery && queryParams.battery !== "Tất cả") {
                    filteredProducts = filteredProducts.filter(item =>
                        item.product_description.battery === queryParams.battery
                    );
                }

                if (queryParams.discount) {
                    filteredProducts = filteredProducts.filter(item =>
                        item.product_detail.some(detail =>
                            detail.discount_detail.length > 0
                        )
                    );
                }

                if (isNew) {
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    filteredProducts = filteredProducts.filter(item =>
                        new Date(item.product_detail.created_at) >= oneMonthAgo
                    );
                }

                filteredProducts.forEach(product => {
                    const ratings = product.rate.map(rate => rate.star);
                    if (ratings.length > 0) {
                        const avgRating = ratings.reduce((total, star) => total + star, 0) / ratings.length;
                        product.averageRating = avgRating.toFixed(1);
                    } else {
                        product.averageRating = 0;
                    }
                });


                if (sortBy === 'popular') {
                    filteredProducts.sort((a, b) => b.averageRating - a.averageRating);
                } else if (sortBy === 'priceDesc') {
                    filteredProducts.sort((a, b) => b.product_detail[0].price - a.product_detail[0].price);
                } else if (sortBy === 'priceAsc') {
                    filteredProducts.sort((a, b) => a.product_detail[0].price - b.product_detail[0].price);
                }

                setListProduct(filteredProducts);
                setNoResults(filteredProducts.length === 0);

                setLoading(false);


            } catch (error) {
                console.error('Error fetching products:', error.response ? error.response.data : error.message);
            }
        };
        fetchData();

    }, [location.search, sortBy, isNew]);
    const handlePriceChange = (event) => {
        const priceValue = event.target.value;
        setPriceRange(priceValue);
        updateURL({ price: priceValue });
    };
    const handleDiscountChange = (event) => {
        const isDiscount = event.target.checked;
        updateURL({ discount: isDiscount ? true : undefined });
    };

    const handleStorageChange = (event) => {
        const storageValue = event.target.value;
        setSelectedStorage(storageValue);
        updateURL({ storage: storageValue });
    };

    const handleBatteryChange = (event) => {
        const batteryValue = event.target.value;
        setSelectedBattery(batteryValue);

        if (batteryValue === "Tất cả") {
            const { battery, ...queryParams } = queryString.parse(location.search);
            updateURL({});
        } else {
            updateURL({ battery: batteryValue });
        }
    };

    const handleRamChange = (event) => {
        const ramValue = event.target.value;
        setSelectedRam(ramValue);
        updateURL({ ram: ramValue });
    };

    const handleProductTypeChange = (event) => {
        const productTypeId = event.target.value;
        setSelectedProductTypeId(productTypeId);


        const normalizedProductTypeId = productTypeId.toLowerCase();

        // Cập nhật URL với tên viết thường của productTypeId
        updateURL({ brand: normalizedProductTypeId });
    };
    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortBy(value);
        updateURL({ sortBy: value }); // Cập nhật sortBy vào URL
    };

    const handleNewChange = (event) => {
        setIsNew(event.target.checked);
        updateURL({ isNew: event.target.checked ? true : undefined });
    };

    const updateURL = (newParams) => {
        const currentParams = queryString.parse(location.search);
        const mergedParams = { ...currentParams, ...newParams };
        const search = queryString.stringify(mergedParams, { arrayFormat: 'comma' });
        navigate(`?${search}`);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = listProduct.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <>
            <header className="p-3 text-white">
                <section className="header-fixed w-100">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid1">
                            <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <i className="fas fa-bars"></i>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2">
                                    <li>
                                        <NavLink to="/" onClick={handleHomeClick} className="nav-link active white"><FontAwesomeIcon icon={faHome} />Trang chủ</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/gioi-thieu" className="nav-link">Giới thiệu</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/tu-van" className="nav-link">Tư vấn</NavLink>
                                    </li>
                                </ul>
                            </div>

                            <div className="search">
                                <div className="input-group">
                                    <input
                                        type="search"
                                        className="form-control form-control-dark"
                                        placeholder="Tìm kiếm..."
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ borderRightWidth: 0, boxShadow: "none" }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = "none";

                                        }}
                                    />
                                    <div className="input-group-append">
                                        <button className="input-group-text bg-transparent border-0" onClick={handleSearch}>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* <button className="btn btn-primary" onClick={handleSearch}>
                            Tìm kiếm
                        </button> */}
                            <div className="login-out">
                                {isLoggedIn ? (
                                    <>
                                        <FontAwesomeIcon icon={faUser} size="1x" className="ml-2" />&nbsp;
                                        <span>Xin chào, <NavLink to="/info" className="info-name">{name}</NavLink></span>
                                        <button className="logout" onClick={logout}><FontAwesomeIcon icon={faSignOutAlt} />Đăng xuất</button>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/login" className='login-user'><FontAwesomeIcon icon={faSignIn} />{' '}Đăng nhập</NavLink>|
                                        <NavLink to="/register" className='register-user'><FontAwesomeIcon icon={faUserPlus} />{' '}Đăng ký</NavLink>
                                    </>
                                )}
                            </div>
                            {isLoggedIn ? (
                                <>
                                    <div className="d-flex align-items-center">
                                        <NavLink className="text-reset me-3" to="/cart">
                                            <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4" />
                                            {sumCart > 0 && (
                                                <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
                                            )}
                                        </NavLink>
                                        <NavLink className="text-reset me-3" to='/order'>
                                            <FontAwesomeIcon icon={faShoppingBag} size="2x" className="ml-2" />
                                            {sumOrder > 0 && (
                                                <span className="badge rounded-pill badge-notification bg-danger">{sumOrder}</span>
                                            )}
                                        </NavLink>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center">
                                        <NavLink className="text-reset me-3" to="/cart">
                                            <FontAwesomeIcon icon={faCartShopping} size="2x" className="mr-4" />
                                            {sumCart > 0 && (
                                                <span className="badge rounded-pill badge-notification bg-danger">{sumCart}</span>
                                            )}
                                        </NavLink>
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>
                </section>
                <div className="header-placeholder"></div>
            </header>

            <div className="banner_new">
                <div className="list_banner">

                    <ListBanner />
                </div>
                <div className="list_new">
                    <News />
                </div>
            </div>
            <div id="body">
                {/* Phần lọc */}

                <div className="price-filter">
                    <select value={priceRange} onChange={handlePriceChange} className="select-price">
                        <option value="" disabled>Giá</option>
                        <option value="0-2999999">Dưới 3 triệu</option>
                        <option value="3000000-5000000">Từ 3 triệu - 5 triệu</option>
                        <option value="5000000-7000000">Từ 5 triệu - 7 triệu</option>
                        <option value="7000000-10000000">Từ 7 triệu - 10 triệu</option>
                        <option value="10000001-60000000">Trên 10 triệu</option>
                    </select>{'  '}

                    <select value={selectedProductTypeId} onChange={handleProductTypeChange} className="select-price">
                        <option disabled>Hãng</option>
                        <option value="">Tất cả</option>
                        {listBrand.map(brand => (
                            <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                    </select>

                    <select value={selectedRam} onChange={handleRamChange} className="select-price">

                        <option disabled>RAM</option>
                        <option value="">Tất cả</option>
                        {listRam && listRam.length > 0 ? (
                            listRam.map((ramOption) => (
                                ramOption && (
                                    <option key={ramOption} value={ramOption}>
                                        {ramOption} GB
                                    </option>
                                )
                            ))
                        ) : (
                            <option disabled>Không có dữ liệu RAM</option>
                        )}
                    </select>

                    <select value={selectedStorage} onChange={handleStorageChange} className="select-price">

                        <option disabled>Dung lượng lưu trữ</option>
                        <option value="">Tất cả</option>
                        {listStorage && listStorage.length > 0 ? (
                            listStorage.map((storageOption) => (
                                <option key={storageOption} value={storageOption}>
                                    {storageOption}
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có dữ liệu Dung lượng</option>
                        )}
                    </select>

                    <select value={selectedBattery} onChange={handleBatteryChange} className="select-price">

                        <option disabled>Pin</option>
                        <option value="">Tất cả</option>
                        {listBattery && listBattery.length > 0 ? (
                            listBattery.map((batteryOption) => (
                                <option key={batteryOption} value={batteryOption}>
                                    {batteryOption} mAh
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có dữ liệu Pin</option>
                        )}
                    </select>
                    <select className="select-price" value={sortBy} onChange={handleSortChange}>
                        <option value="popular">Nổi bật</option>
                        <option value="priceDesc">Giá cao đến thấp</option>
                        <option value="priceAsc">Giá thấp đến cao</option>
                    </select>
                </div>
                <div className="check-discount">
                    <input type="checkbox" className="checkbox-discount" onChange={handleDiscountChange}></input>
                    <p className="p-discount">{'  '}Giảm giá</p>
                    <input type="checkbox" className="checkbox-discount" checked={isNew}
                        onChange={handleNewChange}></input>
                    <p className="p-discount">Mới</p>
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <>
                        < div id="list-product">
                            {noResults ? (
                                <div className="khong-tim-thay">
                                    <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                                    <p>Không có sản phẩm nào được tìm thấy.</p>
                                </div>
                            ) : (
                                currentProducts.map(item => (
                                    <Product key={item.id} member={item} />
                                ))
                            )}
                        </div>
                        {!noResults && (
                            <PaginationProduct
                                currentPage={currentPage}
                                productsPerPage={productsPerPage}
                                totalProducts={listProduct.length}
                                paginate={setCurrentPage}
                            />
                        )}
                    </>)}
            </div >
            <Footer />
        </>
    );
}

export default Trangchu;
