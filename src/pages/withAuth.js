// withAuth.js - Higher Order Component
import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    return class extends React.Component {
        checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            return true;
        }

        render() {
            if (!this.checkAuth()) {
                return <Navigate to="/dang-nhap" />;
            }
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withAuth;
