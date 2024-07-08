import React, { useState } from 'react';

const CommentSection = ({ binhLuan }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 2;

  // Tính tổng số trang
  const totalPages = Math.ceil(binhLuan.length / commentsPerPage);

  // Lấy bình luận cho trang hiện tại
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = binhLuan.slice(indexOfFirstComment, indexOfLastComment);

  // Điều hướng trang
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));

  return (
    <div className="comment-section">
      <h5>Bình luận:</h5>
      <ul className="comment-list">
        {currentComments.map((item, index) => (
          <li key={index} className="comment-item">
            <div className="comment-header">
              <span className="user-name">{item.customer.name}</span>
              <span className="comment-date">{item.date}</span>
            </div>
            <p className="comment-text">{item.content}</p>
            
            {/* Kiểm tra và hiển thị comment của admin */}
            {item.comment_detail && item.comment_detail.length > 0 && (
              <li key={`comment-detail-${index}`} className="comment-item-1">
                <div className="comment-header-1">
                  <span className="user-name-1">{item.comment_detail[0]?.admin?.name}</span>
                  <span className="comment-date-1">{item.comment_detail[0]?.date}</span>
                </div>
                <p className="comment-text-1">{item.comment_detail[0]?.content}</p>
              </li>
            )}
          </li>
        ))}
      </ul>
      <div className="pagination" id="pagination-comment">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className='pagination-1'>{'<<'}</button>
        <span className='so-trang-bl'>Trang {currentPage} trên {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className='pagination-2'>{'>>'}</button>
      </div>
    </div>
  );
};

export default CommentSection;
