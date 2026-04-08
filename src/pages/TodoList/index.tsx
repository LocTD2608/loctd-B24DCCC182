import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Button, Space, Typography, Popconfirm, message, Modal, Form, Input, Select, DatePicker, Tag, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface Todo {
    id: number;
    title: string;
    assignee: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const STORAGE_KEY = 'todolist_advanced';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form] = Form.useForm();

    // Lọc và Tìm kiếm
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [filterAssignee, setFilterAssignee] = useState<string | undefined>(undefined);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setTodos(JSON.parse(stored));
            } catch (error) {
                console.error('Lỗi khi tải todos:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } else if (localStorage.getItem(STORAGE_KEY)) {
            // Chỉ xóa nếu list empty
            localStorage.setItem(STORAGE_KEY, '[]');
        }
    }, [todos]);

    const showAddModal = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ status: 'TODO', priority: 'MEDIUM' });
        setIsModalVisible(true);
    };

    const showEditModal = (record: Todo) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            deadline: dayjs(record.deadline),
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
        message.success('Đã xoá công việc!');
    };

    const handleFinish = (values: any) => {
        const todoData = {
            ...values,
            deadline: values.deadline.format('YYYY-MM-DD'),
        };

        if (editingId) {
            setTodos(todos.map(todo => (todo.id === editingId ? { ...todo, ...todoData } : todo)));
            message.success('Đã cập nhật công việc!');
        } else {
            const newTodo: Todo = { id: Date.now(), ...todoData };
            setTodos([newTodo, ...todos]);
            message.success('Đã thêm công việc mới!');
        }
        setIsModalVisible(false);
    };

    // Derived states
    const assignees = Array.from(new Set(todos.map(t => t.assignee)));

    const filteredTodos = useMemo(() => {
        return todos.filter(todo => {
            const matchSearch = todo.title.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = filterStatus ? todo.status === filterStatus : true;
            const matchAssignee = filterAssignee ? todo.assignee === filterAssignee : true;
            return matchSearch && matchStatus && matchAssignee;
        });
    }, [todos, searchText, filterStatus, filterAssignee]);

    const columns = [
        {
            title: 'Tên công việc',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Người được giao',
            dataIndex: 'assignee',
            key: 'assignee',
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                const config: Record<string, { color: string; text: string }> = {
                    HIGH: { color: 'red', text: 'Cao' },
                    MEDIUM: { color: 'orange', text: 'Trung bình' },
                    LOW: { color: 'blue', text: 'Thấp' },
                };
                const { color, text } = config[priority] || config.MEDIUM;
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config: Record<string, { color: string; text: string }> = {
                    DONE: { color: 'green', text: 'Đã xong' },
                    IN_PROGRESS: { color: 'geekblue', text: 'Đang làm' },
                    TODO: { color: 'default', text: 'Chưa làm' },
                };
                const { color, text } = config[status] || config.TODO;
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Todo) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách Công việc</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large">
                            Thêm công việc
                        </Button>
                    </div>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Input
                                placeholder="Tìm kiếm theo tên công việc..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Lọc theo trạng thái"
                                value={filterStatus}
                                onChange={setFilterStatus}
                                allowClear
                            >
                                <Option value="TODO">Chưa làm</Option>
                                <Option value="IN_PROGRESS">Đang làm</Option>
                                <Option value="DONE">Đã xong</Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Lọc theo người được giao"
                                value={filterAssignee}
                                onChange={setFilterAssignee}
                                allowClear
                            >
                                {assignees.map(a => <Option key={a} value={a}>{a}</Option>)}
                            </Select>
                        </Col>
                    </Row>

                    <Table
                        dataSource={filteredTodos}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: 'Chưa có công việc nào!' }}
                    />
                </Space>
            </Card>

            <Modal
                title={editingId ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="title" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}>
                        <Input placeholder="Nhập tên..." />
                    </Form.Item>

                    <Form.Item name="assignee" label="Người được giao" rules={[{ required: true, message: 'Vui lòng nhập người nhận việc!' }]}>
                        <Input placeholder="Nhập tên người giao..." />
                    </Form.Item>

                    <Form.Item name="priority" label="Mức độ ưu tiên">
                        <Select>
                            <Option value="LOW">Thấp</Option>
                            <Option value="MEDIUM">Trung bình</Option>
                            <Option value="HIGH">Cao</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="deadline" label="Thời hạn (Deadline)" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Option value="TODO">Chưa làm</Option>
                            <Option value="IN_PROGRESS">Đang làm</Option>
                            <Option value="DONE">Đã xong</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TodoList;