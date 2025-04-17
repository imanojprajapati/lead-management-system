import React, { useState } from 'react';
import { Steps, Select, Card, message, Typography, Space, Tag } from 'antd';
import { 
  UserAddOutlined, 
  PhoneOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  CheckOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Title } = Typography;
const { Option } = Select;

const LeadStatusTracker = ({ 
  currentStatus, 
  onStatusChange, 
  leadScore = 0,
  lastUpdated = null
}) => {
  const [loading, setLoading] = useState(false);

  // Define the stages with their icons and colors
  const stages = [
    { 
      key: 'new', 
      title: 'New', 
      icon: <UserAddOutlined />, 
      color: 'blue' 
    },
    { 
      key: 'contacted', 
      title: 'Contacted', 
      icon: <PhoneOutlined />, 
      color: 'cyan' 
    },
    { 
      key: 'in_progress', 
      title: 'In Progress', 
      icon: <SyncOutlined />, 
      color: 'orange' 
    },
    { 
      key: 'followed_up', 
      title: 'Followed Up', 
      icon: <CheckCircleOutlined />, 
      color: 'purple' 
    },
    { 
      key: 'closed', 
      title: 'Closed', 
      icon: <CheckOutlined />, 
      color: 'green' 
    }
  ];

  // Find the current step index
  const currentStepIndex = stages.findIndex(stage => stage.key === currentStatus);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    try {
      await onStatusChange(newStatus);
      message.success(`Lead status updated to ${stages.find(s => s.key === newStatus).title}`);
    } catch (error) {
      message.error('Failed to update lead status');
      console.error('Status update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  return (
    <Card className="lead-status-tracker">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Lead Status</Title>
          <Space>
            <Tag color={getScoreColor(leadScore)}>Score: {leadScore}</Tag>
            {lastUpdated && (
              <Tag color="blue">Updated: {lastUpdated}</Tag>
            )}
          </Space>
        </div>
        
        <Steps
          current={currentStepIndex}
          items={stages.map(stage => ({
            title: stage.title,
            icon: stage.icon,
            status: currentStepIndex > stages.findIndex(s => s.key === stage.key) 
              ? 'finish' 
              : currentStepIndex === stages.findIndex(s => s.key === stage.key) 
                ? 'process' 
                : 'wait'
          }))}
          style={{ marginBottom: 24 }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Select
            value={currentStatus}
            onChange={handleStatusChange}
            style={{ width: 200 }}
            loading={loading}
          >
            {stages.map(stage => (
              <Option key={stage.key} value={stage.key}>
                <Space>
                  {stage.icon}
                  {stage.title}
                </Space>
              </Option>
            ))}
          </Select>
        </div>
      </Space>
    </Card>
  );
};

LeadStatusTracker.propTypes = {
  currentStatus: PropTypes.oneOf(['new', 'contacted', 'in_progress', 'followed_up', 'closed']).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  leadScore: PropTypes.number,
  lastUpdated: PropTypes.string
};

export default LeadStatusTracker; 