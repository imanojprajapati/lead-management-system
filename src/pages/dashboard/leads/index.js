import React, { useState, useCallback, useMemo } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Select, 
  message, 
  Card, 
  Typography,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WhatsAppOutlined,
  TeamOutlined,
  HistoryOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FollowUpModal from '@/components/FollowUpModal';
import FollowUpTimeline from '@/components/FollowUpTimeline';
import dayjs from 'dayjs';
import Link from 'next/link';

const { Title } = Typography;
const { Option } = Select;

// Move constants outside component to prevent recreation on each render
const STATUS_COLORS = {
  New: 'blue',
  Contacted: 'orange',
  'Doc Collected': 'green',
  Applied: 'purple',
  Closed: 'red'
};

const LEAD_STAGES = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Doc Collected', label: 'Doc Collected' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Closed', label: 'Closed' }
];

const VISA_TYPE_COLORS = {
  student: 'blue',
  work: 'green',
  tourist: 'orange',
  pr: 'purple',
  investor: 'gold'
};

const FOLLOW_UP_METHODS = {
  email: 'Email',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  in_person: 'In Person'
};

const LeadsList = () => {
  const router = useRouter();
  const { leads, loading, deleteLead, updateNotes } = useLeads();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [notesForm] = Form.useForm();
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  // Memoize filtered leads to prevent unnecessary recalculations
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchText === '' || 
        lead.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchText.toLowerCase()) ||
        (lead.visaType && lead.visaType.some(type => 
          type.toLowerCase().includes(searchText.toLowerCase())
        ));
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchText, statusFilter]);

  // Memoize table columns to prevent unnecessary re-renders
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <a onClick={() => router.push(`/dashboard/leads/view/${record.id}`)}>{text}</a>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Contact Info',
      key: 'contactInfo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <MailOutlined style={{ color: '#1677ff' }} />
            <span>{record.email}</span>
          </Space>
          <Space>
            <PhoneOutlined style={{ color: '#1677ff' }} />
            <span>{record.phone}</span>
          </Space>
        </Space>
      )
    },
    {
      title: 'Visa Type',
      key: 'visaType',
      render: (_, record) => (
        <Space wrap>
          {record.visaType && record.visaType.map((type, index) => (
            <Tag key={index} color={VISA_TYPE_COLORS[type] || 'default'}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Lead Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status}
        </Tag>
      ),
      filters: LEAD_STAGES.map(stage => ({
        text: stage.label,
        value: stage.value
      })),
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Lead Score',
      dataIndex: 'leadScore',
      key: 'leadScore',
      render: (score) => (
        <Badge 
          count={score} 
          style={{ 
            backgroundColor: score >= 90 ? '#52c41a' : 
                           score >= 70 ? '#1890ff' : 
                           score >= 50 ? '#faad14' : '#f5222d',
            fontSize: '14px',
            padding: '0 8px',
            borderRadius: '10px'
          }} 
        />
      ),
      sorter: (a, b) => a.leadScore - b.leadScore
    },
    {
      title: 'Next Follow-up',
      key: 'nextFollowUp',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.nextFollowUpDate && (
            <Space>
              <CalendarOutlined style={{ color: '#1677ff' }} />
              <span>{dayjs(record.nextFollowUpDate).format('MMM D, YYYY')}</span>
            </Space>
          )}
          {record.followUpMethod && (
            <Tag color="blue">
              {FOLLOW_UP_METHODS[record.followUpMethod] || record.followUpMethod}
            </Tag>
          )}
        </Space>
      ),
      sorter: (a, b) => {
        if (!a.nextFollowUpDate) return 1;
        if (!b.nextFollowUpDate) return -1;
        return dayjs(a.nextFollowUpDate).unix() - dayjs(b.nextFollowUpDate).unix();
      }
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
              onClick={() => router.push(`/dashboard/leads/view/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Lead">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => router.push(`/dashboard/leads/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Follow-up">
            <Button 
              type="link" 
              icon={<HistoryOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => handleFollowUpClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Lead">
            <Popconfirm
              title="Are you sure you want to delete this lead?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ], [leads, router]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setStatusFilter(value);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteLead(id);
      message.success('Lead deleted successfully');
    } catch (error) {
      message.error('Failed to delete lead');
    }
  }, [deleteLead]);

  const handleUpdateNotes = useCallback(async (values) => {
    try {
      await updateNotes(selectedLead.id, values.notes);
      message.success('Notes updated successfully');
      setIsNotesModalVisible(false);
    } catch (error) {
      message.error('Failed to update notes');
    }
  }, [selectedLead, updateNotes]);

  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setStatusFilter('all');
  }, []);

  const handleFollowUpClick = (lead) => {
    setSelectedLead(lead);
    setFollowUpModalVisible(true);
  };

  const handleFollowUpSubmit = (followUpData) => {
    const newFollowUp = {
      id: Date.now(),
      ...followUpData,
      staffName: user.name,
      status: 'pending',
      dateTime: dayjs(followUpData.dateTime).format('YYYY-MM-DD HH:mm:ss')
    };

    setFollowUps(prev => [newFollowUp, ...prev]);
    setFollowUpModalVisible(false);
    message.success('Follow-up added successfully');
  };

  // Memoize the search and filter section to prevent unnecessary re-renders
  const searchAndFilterSection = useMemo(() => (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Input
          placeholder="Search leads..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Select
          style={{ width: '100%' }}
          placeholder="Filter by status"
          value={statusFilter}
          onChange={handleStatusFilter}
          allowClear
        >
          <Option value="all">All Statuses</Option>
          {LEAD_STAGES.map(stage => (
            <Option key={stage.value} value={stage.value}>{stage.label}</Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'right' }}>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
          <Button 
            type="primary" 
            onClick={() => router.push('/dashboard/lead-form')}
          >
            Add New Lead
          </Button>
        </Space>
      </Col>
    </Row>
  ), [searchText, statusFilter, handleSearch, handleStatusFilter, handleResetFilters, router]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'sales']}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={4} style={{ margin: 0 }}>Leads Management</Title>
        </Card>

        {searchAndFilterSection}

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

        <FollowUpModal
          visible={followUpModalVisible}
          onCancel={() => setFollowUpModalVisible(false)}
          onSubmit={handleFollowUpSubmit}
          lead={selectedLead}
        />

        {selectedLead && (
          <FollowUpTimeline
            followUps={followUps.filter(f => f.leadId === selectedLead.id)}
            onAddFollowUp={() => setFollowUpModalVisible(true)}
            onEdit={(followUp) => {
              // Handle edit follow-up
              console.log('Edit follow-up:', followUp);
            }}
          />
        )}

        <Modal
          title="Update Notes"
          open={isNotesModalVisible}
          onOk={() => notesForm.submit()}
          onCancel={() => setIsNotesModalVisible(false)}
          destroyOnClose
        >
          <Form
            form={notesForm}
            layout="vertical"
            onFinish={handleUpdateNotes}
          >
            <Form.Item
              name="notes"
              label="Notes"
              rules={[{ required: true, message: 'Please enter notes' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter notes about the lead" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </ProtectedRoute>
  );
};

export default LeadsList; 