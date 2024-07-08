import React from "react";

function Banner(props) {
    return (
        <div className={`carousel-item ${props.active ? 'active' : ''}`}>
            <img 
                src={`http://localhost:8000/${props.img_url}`} 
                className="d-block w-50" // Điều chỉnh độ rộng và căn giữa
                alt="Slide" 
                style={{ maxWidth: '100%', height: '250px',minWidth: '700px' }} // Thiết lập độ rộng tối đa
            />
        </div>
    );
}

export default Banner;
