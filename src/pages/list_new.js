import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Loading from "../components/loading";
import ListBanner from "./list_banner";
import axios from "axios";
import News from "../components/news";
import { NavLink } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import PaginationOrder from "../components/pagination_order";
import PaginationNew from "../components/pagination_new";

function ListNew() {
    const [listNew, setListNew] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        setLoading(true);
        const fetchRelatedProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/list-new`);
                setListNew(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };

        fetchRelatedProducts();
    }, []);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const itemsToPaginate = listNew.slice(2);

    const offset = currentPage * itemsPerPage;

    const currentItems = itemsToPaginate?.slice(offset, offset + itemsPerPage);

    return (
        <>
            <Header />
            <div className="banner_new">
                <div className="list_banner">
                    <ListBanner />
                </div>
                <div className="list_new">
                    <News data={listNew} />
                </div>
            </div>
            <div id="body">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="news-layout">
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <div className="new-layout1" key={index}>
                                        <NavLink id="news-link" to={`/news/${item.id}`}>
                                            <img src={`http://127.0.0.1:8000/${item.img_url}`} className="img_news_layout" alt={item.title} />
                                            <div className="news_title">{item.title}</div>
                                            <span id="span-new" dangerouslySetInnerHTML={{ __html: item.content.slice(0, 200) + '...' }}></span>
                                        </NavLink>
                                    </div>
                                ))
                            ) : (
                                <p>No news available</p>
                            )}
                        </div>
                        {itemsToPaginate.length > 0 && (
                            <PaginationNew
                                itemsPerPage={itemsPerPage}
                                totalItems={itemsToPaginate.length}
                                currentPage={currentPage}
                                paginate={handlePageClick}
                            />
                        )}

                    </>
                )}
            </div>
            <Footer />
        </>
    );
}
export default ListNew;
