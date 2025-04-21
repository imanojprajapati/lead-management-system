import React, { useState, useMemo } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Select, DatePicker, Row, Col, Statistic } from 'antd';
import { 
  EyeOutlined, 
  HistoryOutlined, 
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FollowUpModal from '@/components/FollowUpModal';
import FollowUpTimeline from '@/components/FollowUpTimeline';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Status colors
const STATUS_COLORS = {
  'New': 'blue',
  'Contacted': 'orange',
  'In Progress': 'purple',
  'Followed Up': 'green',
  'Closed': 'red'
};

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { leads, loading } = useLeads();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);

  // Filter leads based on status and date range
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      let matchesDateRange = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const inquiryDate = dayjs(lead.inquiryDate);
        matchesDateRange = inquiryDate.isAfter(dateRange[0]) && 
                          inquiryDate.isBefore(dateRange[1]);
      }
      
      return matchesStatus && matchesDateRange;
    });
  }, [leads, statusFilter, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    
    const closed = byStatus['Closed'] || 0;
    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    
    const followedUp = byStatus['Followed Up'] || 0;
    const followUpSuccessRate = followedUp > 0 ? Math.round((closed / followedUp) * 100) : 0;
    
    return {
      total,
      byStatus,
      conversionRate,
      followUpSuccessRate
    };
  }, [leads]);

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('all');
    setDateRange(null);
  };

  // View lead details
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setDrawerVisible(true);
  };

  // Edit lead status
  const handleEditStatus = (lead, newStatus) => {
    // TODO: Implement status update with API
    console.log('Updating lead status:', lead.id, newStatus);
  };

  // Follow up with lead
  const handleFollowUp = (lead) => {
    router.push(`/dashboard/leads/view/${lead.id}`);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedLead(null);
  };

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <UserOutlined style={{ color: '#1677ff' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Inquiry Date',
      dataIndex: 'inquiryDate',
      key: 'inquiryDate',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#1677ff' }} />
          {dayjs(date).format('YYYY-MM-DD')}
        </Space>
      )
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (staff) => (
        <Space>
          <TeamOutlined style={{ color: '#1677ff' }} />
          <span>{staff}</span>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewLead(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Status">
            <Select
              defaultValue={record.status}
              style={{ width: 120 }}
              onChange={(value) => handleEditStatus(record, value)}
            >
              {Object.keys(STATUS_COLORS).map(status => (
                <Option key={status} value={status}>
                  <Tag color={STATUS_COLORS[status]}>{status}</Tag>
                </Option>
              ))}
            </Select>
          </Tooltip>
          <Tooltip title="Follow Up">
            <Button 
              type="link" 
              icon={<HistoryOutlined />} 
              onClick={() => handleFollowUp(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ], []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'sales']}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Leads"
                value={stats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Conversion Rate"
                value={stats.conversionRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Follow-up Success Rate"
                value={stats.followUpSuccessRate}
                suffix="%"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Leads"
                value={stats.byStatus['New'] || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 200 }}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value="all">All Statuses</Option>
              {Object.keys(STATUS_COLORS).map(status => (
                <Option key={status} value={status}>
                  <Tag color={STATUS_COLORS[status]}>{status}</Tag>
                </Option>
              ))}
            </Select>
            <RangePicker onChange={handleDateRangeChange} />
            <Button onClick={handleResetFilters}>Reset Filters</Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredLeads}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredLeads.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} leads`
            }}
          />
        </Card>

        <FollowUpModal
          visible={followUpModalVisible}
          onCancel={() => setFollowUpModalVisible(false)}
          onSubmit={(values) => {
            console.log('Follow-up submitted:', values);
            setFollowUpModalVisible(false);
          }}
          lead={selectedLead}
        />
      </Space>
    </ProtectedRoute>
  );
};

export default DashboardPage; 