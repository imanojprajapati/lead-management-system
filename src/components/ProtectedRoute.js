import React from 'react';
import { useRouter } from 'next/router';
import { Result, Button } from 'antd';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />
    );
  }

  return children;
};

export default ProtectedRoute; 