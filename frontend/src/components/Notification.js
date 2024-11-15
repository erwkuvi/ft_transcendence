import './Notification.css'

const Notification = ({ title, description, onConfirm, onReject, read }) => {
	return (
		<div className={`notification m-0 p-3 ${read ? 'read' : 'unread'}`} onMouseEnter={onConfirm}>
			<div className="notification-text">
				<h4 className="notification-title">{title}</h4>
				<p className="notification-description">{description}</p>
			</div>
			<div className="notification-buttons">
				<button className="btn confirm-btn" onClick={onConfirm}>
					<i className="fas fa-check"></i>
				</button>
				<button className="btn reject-btn" onClick={onReject}>
					<i className="fas fa-times"></i>
				</button>
			</div>
		</div>
	);
};

export default Notification;