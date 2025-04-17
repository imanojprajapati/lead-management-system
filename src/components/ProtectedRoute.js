import React, { useEffect, memo } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { Result, Button } from 'antd';

const ProtectedRoute = memo(({ children, requiredPermission }) => {
  const router = useRouter();
  const { user, loading, isAuthenticated, hasPermission } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button 
            type="primary" 
            onClick={() => router.replace('/dashboard/leads')}
          >
            Back to Leads
          </Button>
        }
      />
    );
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.oneOf(['dashboard', 'leads', 'users', 'analytics'])
};

export default ProtectedRoute; 