import React, { useEffect, useState } from "react";
import CTSanPham from "../components/chi_tiet_san_pham";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/loading";

function ChiTietSanPham() {
    const [product, setProduct] = useState({});
    const { slug } = useParams(); // Sử dụng slug thay vì productName vì đã truyền từ Route "/product/:slug"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                if (slug) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/product/${slug}`);
                    setProduct(response.data.data);
                } else {
                    console.log('No valid slug found in URL');
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]); // Đặt slug vào dependency array để useEffect chạy lại khi slug thay đổi

    const productUI = () => {
        if (loading) {
            return <Loading />;
        } else if (product && Object.keys(product).length > 0) {
            return <CTSanPham data={product} />;
        } else {
            return <p>No product found</p>; // This handles the case where no product data is available
        }
    };

    return (
        <>
            {productUI()}
        </>
    );
}

export default ChiTietSanPham;
