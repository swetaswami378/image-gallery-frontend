
import { toast } from 'react-toastify';

const baseOptions = {
	position: 'bottom-right',
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
};

export function showSuccess(message = 'Success', options = {}) {
	toast.success(message, { autoClose: 3000, ...baseOptions, ...options });
}

export function showError(message = 'Something went wrong', options = {}) {
	toast.error(message, { autoClose: 5000, ...baseOptions, ...options });
}

export function showInfo(message = 'Info', options = {}) {
	toast.info(message, { autoClose: 3000, ...baseOptions, ...options });
}

const Toast = { showSuccess, showError, showInfo };

export default Toast;
