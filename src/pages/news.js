import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import axios from "axios";
import Loading from "../components/loading";

function News() {
    const [news, setNews] = useState([]);
    const { getNew } = useParams();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true)
        const fetchRelatedProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-news/${getNew}`);
                setNews(response.data.data);
                
                setLoading(false)
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };

        fetchRelatedProducts();
    }, []);
    
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
    
    return (
        <>
           <Header/>
            {loading ?(
                <Loading/>
            ):(
                
                <div id="new_detail">
                <div className="title-time"><h7><NavLink to='/' className='menu'>Trang chủ</NavLink>{' | '}<NavLink to='' className='menu'>tin tức</NavLink></h7>
                <span className="new-time">{formatDate(news?.created_at)}</span></div>
                <h2 className="new-detail-title">{news.title}</h2>
                <span dangerouslySetInnerHTML={{ __html: news.content }}></span>
                </div>
            )
            }
           <Footer/>
        </>
    );
}

export default News;
