import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const STORAGE_KEY = 'todolist_advanced';

const Statistics: React.FC = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const todos = JSON.parse(stored);
        setTotalTasks(todos.length);
        setCompletedTasks(todos.filter((t: any) => t.status === 'DONE').length);
      } catch (error) {
        console.error('Lỗi tải data', error);
      }
    }
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title={<Title level={4}>Thống kê & Báo cáo</Title>}>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Tổng số công việc"
                value={totalTasks}
                valueStyle={{ color: '#1890ff' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Công việc đã hoàn thành"
                value={completedTasks}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Statistics;