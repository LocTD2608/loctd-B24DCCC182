import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Checkbox, Space, Typography, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: number;
}

const STORAGE_KEY = 'todolist';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setTodos(parsed);
            } catch (error) {
                console.error('Error loading todos:', error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const handleAdd = () => {
        if (!inputValue.trim()) {
            message.warning('Vui lòng nhập nội dung todo!');
            return;
        }

        const newTodo: Todo = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
        message.success('Đã thêm todo mới!');
    };

    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
        message.success('Đã xoá todo!');
    };

    const startEdit = (todo: Todo) => {
        setEditId(todo.id);
        setEditText(todo.text);
    };

    const saveEdit = () => {
        if (!editText.trim()) {
            message.warning('Nội dung không được trống!');
            return;
        }

        setTodos(todos.map(todo =>
            todo.id === editId ? { ...todo, text: editText.trim() } : todo
        ));
        setEditId(null);
        setEditText('');
        message.success('Đã cập nhập todo!');
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditText('');
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={2}>Danh sách Todo List</Title>

                    {/* Input thêm todo */}
                    <Space size={0} style={{ width: '100%' }}>
                        <Input
                            placeholder="Nhập todo mới..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleAdd}
                            size="large"
                            style={{ flex: 1 }}
                        />
                        <Button type="primary" onClick={handleAdd} size="large">
                            Thêm
                        </Button>
                    </Space>

                    {/* Danh sách todos */}
                    <List
                        dataSource={todos}
                        locale={{ emptyText: 'Chưa có todo nào ,Hãy thêm todo mới !' }}
                        renderItem={(todo) => (
                            <List.Item
                                key={todo.id}
                                style={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    opacity: todo.completed ? 0.6 : 1,
                                }}
                                actions={[
                                    editId === todo.id ? (
                                        <Space key="edit-actions">
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={saveEdit}
                                                size="small"
                                            >
                                                Lưu
                                            </Button>
                                            <Button
                                                icon={<CloseOutlined />}
                                                onClick={cancelEdit}
                                                size="small"
                                            >
                                                Hủy
                                            </Button>
                                        </Space>
                                    ) : (
                                        <Space key="normal-actions">
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => startEdit(todo)}
                                                size="small"
                                            />
                                            <Popconfirm
                                                title="bạn có chắc muốn xoá?"
                                                onConfirm={() => handleDelete(todo.id)}
                                                okText="Xoá"
                                                cancelText="Hủy"
                                            >
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                />
                                            </Popconfirm>
                                        </Space>
                                    ),
                                ]}
                            >
                                <Space>
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => toggleComplete(todo.id)}
                                    />
                                    {editId === todo.id ? (
                                        <Input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onPressEnter={saveEdit}
                                            autoFocus
                                        />
                                    ) : (
                                        <span>{todo.text}</span>
                                    )}
                                </Space>
                            </List.Item>
                        )}
                    />

                    {/* Thông kê */}
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        Tổng: {todos.length} | Hoàn thành: {todos.filter(t => t.completed).length}
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default TodoList;
