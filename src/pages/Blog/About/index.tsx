import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Tag, Space, Spin, Button } from 'antd';
import { GithubOutlined, FacebookOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { blogService, IAuthor } from '@/services/Blog/blogService';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

const BlogAbout: React.FC = () => {
	const [author, setAuthor] = useState<IAuthor | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAuthor = async () => {
			try {
				const data = await blogService.getAuthor();
				setAuthor(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchAuthor();
	}, []);

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size="large" />
			</div>
		);
	}

	if (!author) {
		return <div>Không có dữ liệu tác giả.</div>;
	}

	return (
		<div className={styles.aboutContainer}>
			<div className={styles.heroSection}>
				<Title className={styles.heroTitle}>Về Tác Giả</Title>
				<Paragraph className={styles.heroSubtitle}>Người đứng sau những bài viết</Paragraph>
			</div>

			<div className={styles.mainContent}>
				<Card className={styles.profileCard}>
					<Row gutter={[48, 32]} align="middle">
						<Col xs={24} md={8} className={styles.avatarCol}>
							<div className={styles.avatarWrapper}>
								<Avatar src={author.avatar} size={200} className={styles.avatar} />
							</div>
						</Col>
						<Col xs={24} md={16}>
							<Title level={2}>{author.name}</Title>
							<Paragraph className={styles.bioText}>
								{author.bio}
							</Paragraph>

							<div className={styles.skillsSection}>
								<Title level={5}>Kỹ năng chuyên môn</Title>
								<div>
									{author.skills.map(skill => (
										<Tag color="cyan" key={skill} className={styles.skillTag}>{skill}</Tag>
									))}
								</div>
							</div>

							<div className={styles.socialSection}>
								<Title level={5}>Kết nối với tôi</Title>
								<Space size="middle">
									{author.social?.github && (
										<Button type="primary" shape="circle" icon={<GithubOutlined />} href={author.social.github} target="_blank" />
									)}
									{author.social?.linkedin && (
										<Button type="primary" shape="circle" icon={<LinkedinOutlined />} href={author.social.linkedin} target="_blank" style={{ background: '#0e76a8', borderColor: '#0e76a8' }} />
									)}
									{author.social?.facebook && (
										<Button type="primary" shape="circle" icon={<FacebookOutlined />} href={author.social.facebook} target="_blank" style={{ background: '#3b5998', borderColor: '#3b5998' }} />
									)}
									<Button type="default" shape="circle" icon={<MailOutlined />} href="mailto:contact@example.com" />
								</Space>
							</div>
						</Col>
					</Row>
				</Card>
			</div>
		</div>
	);
};

export default BlogAbout;
