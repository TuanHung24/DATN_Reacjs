import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import axios from "axios";
import Loading from "../components/loading";
import ListBanner from "./list_banner";
import News from "../components/news";

function New() {
    const { getNew } = useParams();
    const [news, setNews] = useState({});
    const [listNew, setListNew] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-news/${getNew}`);
                setNews(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching main news:", error);
            }
        };

        const fetchRelatedProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-news-banner/${getNew}`);
                setListNew(response.data.data.data);
            } catch (error) {
                console.error("Error fetching related news for banner:", error);
            }
        };

        fetchNews();
        fetchRelatedProducts();
    }, [getNew]); 

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
            <Header />
            <div className="banner_new">
                <div className="list_banner">
                    <ListBanner />
                </div>
                <div className="list_new">
                    {listNew.length > 0 ? listNew.map((item) => (
                        <NavLink key={item.id} className="news" to={`/news/${item.id}`}>
                            <img src={`http://127.0.0.1:8000/${item.img_url}`} className="img_news" alt={item.title} />
                            <span className="news_title">{item.title}</span>
                        </NavLink>
                    )) : <p>No news available</p>}
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div id="new_detail">
                    <div className="title-time">
                        <h7><NavLink to='/' className='menu'>Trang chủ</NavLink>{' | '}<NavLink to='' className='menu'>tin tức</NavLink></h7>
                        <span className="new-time">{formatDate(news?.created_at)}</span>
                    </div>
                    <h2 className="new-detail-title">{news.title}</h2>
                    <span dangerouslySetInnerHTML={{ __html: news.content }}></span>
                </div>
            )}
            <Footer />
        </>
    );
}

export default New;
