import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Select, Tag, Space, Popconfirm, Modal, Form, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { blogService, IArticle, ITag } from '@/services/Blog/blogService';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

const ArticleManagement: React.FC = () => {
	const [articles, setArticles] = useState<IArticle[]>([]);
	const [tags, setTags] = useState<ITag[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const fetchData = async () => {
		setLoading(true);
		try {
			const [articlesData, tagsData] = await Promise.all([
				blogService.getArticles(),
				blogService.getTags(),
			]);
			setArticles(articlesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
			setTags(tagsData);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await blogService.deleteArticle(id);
			message.success('Đã xóa bài viết');
			fetchData();
		} catch (error) {
			message.error('Lỗi khi xóa');
		}
	};

	const handleAddOrEdit = () => {
		setEditingId(null);
		form.resetFields();
		form.setFieldsValue({ status: 'draft', tags: [] });
		setIsModalVisible(true);
	};

	const handleEdit = (record: IArticle) => {
		setEditingId(record.id);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			if (editingId) {
				await blogService.updateArticle(editingId, values);
				message.success('Cập nhật thành công');
			} else {
				// add
				const slug = values.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
				await blogService.addArticle({ ...values, slug: values.slug || slug });
				message.success('Thêm mới thành công');
			}
			setIsModalVisible(false);
			fetchData();
		} catch (error) {
			console.log('Validate Failed:', error);
		}
	};

	const filteredArticles = articles.filter(a => {
		const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchStatus = statusFilter ? a.status === statusFilter : true;
		return matchSearch && matchStatus;
	});

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			width: '30%',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>
					{status === 'published' ? 'Đã đăng' : 'Bản nháp'}
				</Tag>
			),
		},
		{
			title: 'Thẻ (Tags)',
			dataIndex: 'tags',
			key: 'tags',
			render: (tagIds: string[]) => (
				<>
					{tagIds.map(id => {
						const tagObj = tags.find(t => t.id === id);
						return tagObj ? <Tag key={id}>{tagObj.name}</Tag> : null;
					})}
				</>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'views',
			key: 'views',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (val: string) => new Date(val).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: IArticle) => (
				<Space size="middle">
					<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa?"
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
			<Card title="Quản lý Bài viết">
				<div className={styles.toolbar}>
					<Space>
						<Search 
							placeholder="Tìm theo tiêu đề" 
							allowClear 
							onSearch={val => setSearchTerm(val)} 
							style={{ width: 250 }} 
						/>
						<Select 
							placeholder="Lọc theo trạng thái" 
							allowClear 
							style={{ width: 150 }}
							onChange={val => setStatusFilter(val)}
						>
							<Option value="published">Đã đăng</Option>
							<Option value="draft">Bản nháp</Option>
						</Select>
					</Space>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAddOrEdit}>
						Thêm bài viết mới
					</Button>
				</div>
				
				<Table 
					columns={columns} 
					dataSource={filteredArticles} 
					rowKey="id" 
					loading={loading}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<Modal
				title={editingId ? 'Sửa bài viết' : 'Thêm bài viết mới'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				width={800}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
						<Input placeholder="Nhập tiêu đề bài viết" />
					</Form.Item>
					
					<Form.Item name="slug" label="Đường dẫn (Slug)">
						<Input placeholder="Nhập slug (bỏ trống sẽ tự sinh từ tiêu đề)" />
					</Form.Item>

					<Form.Item name="summary" label="Tóm tắt">
						<Input.TextArea rows={2} placeholder="Nhập tóm tắt bài viết" />
					</Form.Item>

					<Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
						<Input.TextArea rows={10} placeholder="Nhập nội dung bài viết bằng Markdown..." style={{ fontFamily: 'monospace' }} />
					</Form.Item>

					<Form.Item name="thumbnail" label="URL Ảnh đại diện">
						<Input placeholder="https://example.com/imaghttps://i.pinimg.com/736x/f0/f8/85/f0f885b81b5848e9b9379f3e6e0a2437.jpge.jpg" />
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="tags" label="Thẻ (Tags)">
								<Select mode="multiple" placeholder="Chọn thẻ">
									{tags.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
								<Select>
									<Option value="draft">Bản nháp</Option>
									<Option value="published">Đã đăng</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default ArticleManagement;
