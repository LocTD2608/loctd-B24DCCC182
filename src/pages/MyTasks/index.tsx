import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

interface Todo {
  id: number;
  title: string;
  assignee: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const STORAGE_KEY = 'todolist_advanced';

const MyTasksPage: React.FC = () => {
  const [myTasks, setMyTasks] = useState<Todo[]>([]);
  const currentUser = localStorage.getItem('username') || '';

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const todos: Todo[] = JSON.parse(stored);
        // Filter by assignee
        const userTasks = todos.filter(t => t.assignee === currentUser);
        setMyTasks(userTasks);
      } catch (error) {
        console.error('Lỗi khi tải todos:', error);
      }
    }
  }, [currentUser]);

  const columns = [
    { title: 'Tên công việc', dataIndex: 'title', key: 'title' },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      render: (priority: string) => {
        const config: Record<string, { color: string; text: string }> = {
          HIGH: { color: 'red', text: 'Cao' },
          MEDIUM: { color: 'orange', text: 'Trung bình' },
          LOW: { color: 'blue', text: 'Thấp' },
        };
        const { color, text } = config[priority] || config.MEDIUM;
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          DONE: { color: 'green', text: 'Đã xong' },
          IN_PROGRESS: { color: 'geekblue', text: 'Đang làm' },
          TODO: { color: 'default', text: 'Chưa làm' },
        };
        const { color, text } = config[status] || config.TODO;
        return <Tag color={color}>{text}</Tag>;
      }
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title={<Title level={4}>Công việc của: {currentUser || 'Khách'}</Title>}>
        <Table
          columns={columns}
          dataSource={myTasks}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Bạn chưa có công việc nào được giao!' }}
        />
      </Card>
    </div>
  );
};

export default MyTasksPage;