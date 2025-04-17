import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { Result, Button } from 'antd';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const router = useRouter();
  const { user, loading, isAuthenticated, hasPermission } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check if user has required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard/leads')}>
            Back to Leads
          </Button>
        }
      />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.oneOf(['dashboard', 'leads', 'users', 'analytics'])
};

export default ProtectedRoute; 