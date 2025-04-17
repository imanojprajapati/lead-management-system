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
  PlusOutlined
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
  meeting: <CalendarOutlined style={{ color: '#fa8c16' }} />
};

const STATUS_COLORS = {
  completed: 'success',
  pending: 'processing',
  missed: 'error'
};

const FollowUpTimeline = ({ followUps = [], onAddFollowUp }) => {
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
      meeting: '#fa8c16'
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
          <CalendarOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
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
      style={{ marginTop: 24 }}
    >
      <Timeline
        items={followUps.map(followUp => ({
          dot: getMethodAvatar(followUp.method),
          color: followUp.status === 'completed' ? 'green' : 
                 followUp.status === 'missed' ? 'red' : 'blue',
          children: (
            <Card 
              size="small" 
              style={{ 
                marginBottom: 16,
                backgroundColor: followUp.status === 'pending' ? '#f0f7ff' : '#fff'
              }}
            >
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space>
                    <Text strong>
                      {followUp.method.charAt(0).toUpperCase() + followUp.method.slice(1)}
                    </Text>
                    <Tag 
                      icon={getStatusIcon(followUp.status)}
                      color={STATUS_COLORS[followUp.status]}
                    >
                      {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                    </Tag>
                  </Space>
                  <Tooltip title={dayjs(followUp.date).format('MMMM D, YYYY h:mm A')}>
                    <Text type="secondary">
                      {dayjs(followUp.date).fromNow()}
                    </Text>
                  </Tooltip>
                </Space>
                
                <Space>
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <Text>{followUp.assignedToName}</Text>
                </Space>
                
                <Text style={{ 
                  marginTop: 8,
                  color: followUp.status === 'missed' ? '#ff4d4f' : 'inherit'
                }}>
                  {followUp.notes}
                </Text>
              </Space>
            </Card>
          )
        }))}
      />
    </Card>
  );
};

export default FollowUpTimeline; 