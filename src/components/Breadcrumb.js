import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, FormOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CustomBreadcrumb = () => {
  const router = useRouter();
  const { pathname } = router;

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: (
          <Link href="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        ),
        key: 'dashboard',
      },
    ];

    if (pathname.includes('/leads')) {
      items.push({
        title: <Link href="/dashboard/leads">Leads</Link>,
        key: 'leads',
      });
    }

    if (pathname.includes('/lead-form')) {
      items.push({
        title: <FormOutlined />,
        key: 'form',
      });
      items.push({
        title: 'Add Lead',
        key: 'add-lead',
      });
    }

    if (pathname.includes('/leads/') && !pathname.includes('/edit')) {
      items.push({
        title: <EyeOutlined />,
        key: 'view',
      });
      items.push({
        title: 'View Lead',
        key: 'view-lead',
      });
    }

    if (pathname.includes('/edit')) {
      items.push({
        title: <FormOutlined />,
        key: 'edit',
      });
      items.push({
        title: 'Edit Lead',
        key: 'edit-lead',
      });
    }

    return items;
  };

  return (
    <Breadcrumb
      items={getBreadcrumbItems()}
      style={{ margin: '16px 24px' }}
    />
  );
};

export default CustomBreadcrumb; 