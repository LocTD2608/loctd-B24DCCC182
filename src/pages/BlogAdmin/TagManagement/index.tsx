import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Popconfirm, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { blogService, ITag } from '@/services/Blog/blogService';
import styles from './index.less';

const TagManagement: React.FC = () => {
	const [tags, setTags] = useState<ITag[]>([]);
	const [loading, setLoading] = useState(true);
	
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const fetchTags = async () => {
		setLoading(true);
		try {
			const data = await blogService.getTags();
			setTags(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu thẻ');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTags();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await blogService.deleteTag(id);
			message.success('Đã xóa thẻ');
			fetchTags();
		} catch (error) {
			message.error('Lỗi khi xóa thẻ');
		}
	};

	const handleAddOrEdit = () => {
		setEditingId(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (record: ITag) => {
		setEditingId(record.id);
		form.setFieldsValue({ name: record.name });
		setIsModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (editingId) {
				await blogService.updateTag(editingId, values.name);
				message.success('Cập nhật thẻ thành công');
			} else {
				await blogService.addTag({ name: values.name });
				message.success('Thêm mới thẻ thành công');
			}
			setIsModalVisible(false);
			fetchTags();
		} catch (error) {
			console.log('Validate Failed:', error);
		}
	};

	const columns = [
		{
			title: 'Tên Thẻ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số lượng bài viết',
			dataIndex: 'articleCount',
			key: 'articleCount',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (_: any, record: ITag) => (
				<Space size="middle">
					<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa thẻ này?"
						onConfirm={() => handleDelete(record.id)}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Button type="text" danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className={styles.adminContainer}>
			<Card title="Quản lý Thẻ (Tags)">
				<div className={styles.toolbar}>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAddOrEdit}>
						Thêm thẻ mới
					</Button>
				</div>
				
				<Table 
					columns={columns} 
					dataSource={tags} 
					rowKey="id" 
					loading={loading}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<Modal
				title={editingId ? 'Sửa thẻ' : 'Thêm thẻ mới'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item 
						name="name" 
						label="Tên thẻ" 
						rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
					>
						<Input placeholder="Nhập tên thẻ..." />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TagManagement;
