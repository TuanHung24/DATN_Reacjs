import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-news`);
                setNews(response.data.data.data);
                
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };

        fetchRelatedProducts();
    }, []);
   
    return (
        <>
            {news.length > 0 ? news.map((item, index) => (
                <NavLink className="news" to={`/news/${item.id}`}>
                <img src={`http://127.0.0.1:8000/${item.img_url}`} className="img_news"/>
                <span key={index} className="news_title">{item.title}</span>
                </NavLink>
            )) : <p>No news available</p>}
        </>
    );
}

export default News;
