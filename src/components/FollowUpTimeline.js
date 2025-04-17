import React from 'react';
import { Timeline, Card, Typography, Tag, Space, Button, Avatar, Tooltip } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  MessageOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.locale('en');

const { Text, Title } = Typography;

const METHOD_ICONS = {
  call: <PhoneOutlined style={{ color: '#1890ff' }} />,
  email: <MailOutlined style={{ color: '#52c41a' }} />,
  message: <MessageOutlined style={{ color: '#722ed1' }} />,
  meeting: <CalendarOutlined style={{ color: '#fa8c16' }} />,
  whatsapp: <MessageOutlined style={{ color: '#25D366' }} />
};

const STATUS_COLORS = {
  completed: 'success',
  pending: 'processing',
  missed: 'error'
};

const STATUS_ICONS = {
  completed: <CheckCircleOutlined />,
  pending: <ClockCircleOutlined />,
  missed: <ClockCircleOutlined />
};

const FollowUpTimeline = ({ 
  followUps = [], 
  onAddFollowUp,
  onEdit,
  loading = false 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'missed':
        return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getMethodAvatar = (method) => {
    const colors = {
      call: '#1890ff',
      email: '#52c41a',
      message: '#722ed1',
      meeting: '#fa8c16',
      whatsapp: '#25D366'
    };

    return (
      <Avatar 
        style={{ 
          backgroundColor: colors[method],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {METHOD_ICONS[method]}
      </Avatar>
    );
  };

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <Title level={4} style={{ margin: 0 }}>Follow-up History</Title>
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onAddFollowUp}
        >
          Add Follow-up
        </Button>
      }
      loading={loading}
    >
      <Timeline
        items={followUps.map((followUp, index) => ({
          color: index === 0 ? '#1890ff' : '#d9d9d9',
          children: (
            <Card 
              size="small" 
              style={{ 
                marginBottom: 16,
                backgroundColor: index === 0 ? '#f0f7ff' : '#fff'
              }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    {getMethodAvatar(followUp.method)}
                    <Text strong>
                      {followUp.method.charAt(0).toUpperCase() + followUp.method.slice(1)}
                    </Text>
                  </Space>
                  <Space>
                    <Tooltip title={dayjs(followUp.dateTime).format('MMMM D, YYYY h:mm A')}>
                      <Text type="secondary">
                        {dayjs(followUp.dateTime).fromNow()}
                      </Text>
                    </Tooltip>
                    {onEdit && (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={() => onEdit(followUp)}
                      />
                    )}
                  </Space>
                </Space>

                <Space>
                  <UserOutlined />
                  <Text type="secondary">{followUp.staffName}</Text>
                </Space>

                <Text>{followUp.notes}</Text>

                {followUp.status && (
                  <Tag color={followUp.status === 'completed' ? 'success' : 'processing'}>
                    {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                  </Tag>
                )}
              </Space>
            </Card>
          )
        }))}
      />
    </Card>
  );
};

export default FollowUpTimeline; 