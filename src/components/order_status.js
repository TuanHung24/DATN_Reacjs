function OrderStatusBar({ currentStatus }) {
    const statusStages = [
        { key: 1, label: "Chờ duyệt", className: "pending" },
        { key: 2, label: "Đã duyệt", className: "awaiting " },
        { key: 3, label: "Đang giao", className: "delivering" },
        { key: 4, label: "Đã giao", className: "completed" }
    ];

    return (
        <div className="order-status-bar">
            {statusStages.map((stage) => (
                <div key={stage.key} className={`status-stage ${stage.className} ${currentStatus >= stage.key ? 'active' : ''}`}>
                    <span className="status-label">{stage.label}</span>
                </div>
            ))}
        </div>
    );
}
export default OrderStatusBar;