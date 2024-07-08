import React, { useState } from 'react';

const RatingModal = ({ orderId, closeModal }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRatingSubmit = () => {
      
        console.log("Đánh giá:", rating);

        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Đánh giá đơn hàng #{orderId}</h2>
                <div onClick={handleRatingChange}></div>
                <textarea value={comment} onChange={handleCommentChange}></textarea>
                <button onClick={handleRatingSubmit}>Gửi đánh giá</button>
                <button onClick={closeModal}>Đóng</button>
            </div>
        </div>
    );
};

export default RatingModal;
