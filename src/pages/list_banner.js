import axios from "axios";
import { useEffect, useState } from "react";
import Banner from "../components/banner";

function ListBanner() {
    const [dsBanner, setDSBanner] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // State to track active index

    useEffect(() => {
        const getBanner = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/slides');
                setDSBanner(response.data.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        getBanner();
    }, []);

    const handlePrev = () => {
        setActiveIndex(prevIndex => (prevIndex === 0 ? dsBanner.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex(prevIndex => (prevIndex === dsBanner.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {dsBanner.map((item, index) => (
                    <Banner key={index} img_url={item.img_url} active={index === activeIndex} />
                ))}
            </div>
            <button className="carousel-control-prev"  type="button" onClick={handlePrev}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next"  type="button" onClick={handleNext}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default ListBanner;
