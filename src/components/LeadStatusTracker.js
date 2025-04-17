import React from 'react';
import { Steps, Card, Typography, Button, Space, message, Tooltip } from 'antd';
import { 
  UserAddOutlined, 
  PhoneOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LEAD_STAGES = [
  {
    key: 'new',
    title: 'New',
    icon: <UserAddOutlined />,
    description: 'Lead just created'
  },
  {
    key: 'contacted',
    title: 'Contacted',
    icon: <PhoneOutlined />,
    description: 'Initial contact made'
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    icon: <SyncOutlined />,
    description: 'Working on the lead'
  },
  {
    key: 'followed_up',
    title: 'Followed Up',
    icon: <CheckCircleOutlined />,
    description: 'Follow-up completed'
  },
  {
    key: 'closed',
    title: 'Closed',
    icon: <CloseCircleOutlined />,
    description: 'Lead closed'
  }
];

const LeadStatusTracker = ({ 
  currentStage, 
  onStageChange,
  leadScore,
  lastUpdated
}) => {
  const currentIndex = LEAD_STAGES.findIndex(stage => stage.key === currentStage);

  const handleStageClick = (stage) => {
    if (LEAD_STAGES.findIndex(s => s.key === stage.key) <= currentIndex + 1) {
      onStageChange(stage.key);
      message.success(`Lead status updated to ${stage.title}`);
    } else {
      message.warning('Cannot skip stages. Please complete the current stage first.');
    }
  };

  return (
    <Card
      title={
        <Space>
          <SyncOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Lead Status</Title>
        </Space>
      }
      extra={
        <Space>
          <Text type="secondary">Score: </Text>
          <Text strong style={{ 
            color: leadScore >= 80 ? '#52c41a' : 
                   leadScore >= 60 ? '#1890ff' : 
                   leadScore >= 40 ? '#faad14' : '#ff4d4f'
          }}>
            {leadScore}
          </Text>
        </Space>
      }
    >
      <Steps
        current={currentIndex}
        items={LEAD_STAGES.map(stage => ({
          title: (
            <Tooltip title={stage.description}>
              <span>{stage.title}</span>
            </Tooltip>
          ),
          icon: stage.icon,
          status: stage.key === currentStage ? 'process' : 
                 LEAD_STAGES.findIndex(s => s.key === stage.key) < currentIndex ? 'finish' : 'wait',
          onClick: () => handleStageClick(stage)
        }))}
        style={{ cursor: 'pointer' }}
      />
      
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Text type="secondary">
          Last updated: {lastUpdated}
        </Text>
      </div>
    </Card>
  );
};

export default LeadStatusTracker; 