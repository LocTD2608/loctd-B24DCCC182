import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Spin, Typography, Tag, Divider, Row, Col, Card, Button, Space, Avatar } from 'antd';
import { ClockCircleOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogService, IArticle, ITag } from '@/services/Blog/blogService';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
	const params = useParams<{ id: string }>();
	const [article, setArticle] = useState<IArticle | null>(null);
	const [relatedArticles, setRelatedArticles] = useState<IArticle[]>([]);
	const [allTags, setAllTags] = useState<ITag[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArticle = async () => {
			if (!params.id) return;
			setLoading(true);
			try {
				// Tăng view
				await blogService.incrementViewCount(params.id);
				
				const [fetchedArticle, tags, allPublished] = await Promise.all([
					blogService.getArticleById(params.id),
					blogService.getTags(),
					blogService.getPublishedArticles()
				]);
				
				setArticle(fetchedArticle);
				setAllTags(tags);

				if (fetchedArticle) {
					// Tìm bài viết liên quan (cùng tag, loại trừ bài hiện tại)
					const related = allPublished.filter(
						(a) => a.id !== fetchedArticle.id && a.tags.some((t) => fetchedArticle.tags.includes(t))
					);
					setRelatedArticles(related.slice(0, 3)); // Lấy tối đa 3 bài
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchArticle();
	}, [params.id]);

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size="large" />
			</div>
		);
	}

	if (!article) {
		return (
			<div className={styles.errorContainer}>
				<Title level={3}>Bài viết không tồn tại</Title>
				<Button type="primary" onClick={() => history.push('/blog')}>
					Quay lại trang chủ Blog
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.articleDetailContainer}>
			<div className={styles.heroSection} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${article.thumbnail || 'https://via.placeholder.com/1200x400'})` }}>
				<div className={styles.heroContent}>
					<Button type="text" className={styles.backButton} onClick={() => history.push('/blog')}>
						<ArrowLeftOutlined /> Quay lại
					</Button>
					
					<div className={styles.tagList}>
						{article.tags.map((tid) => {
							const t = allTags.find((tag) => tag.id === tid);
							return t ? <Tag color="blue" key={tid}>{t.name}</Tag> : null;
						})}
					</div>

					<Title className={styles.articleTitle}>{article.title}</Title>
					
					<div className={styles.articleMeta}>
						<Space size="large">
							<Space>
								<Avatar src={article.author.avatar} size="small" />
								{article.author.name}
							</Space>
							<Space>
								<ClockCircleOutlined /> {formatDate(article.createdAt)}
							</Space>
							<Space>
								<EyeOutlined /> {article.views}
							</Space>
						</Space>
					</div>
				</div>
			</div>

			<div className={styles.mainContent}>
				<div className={styles.markdownContent}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{article.content}
					</ReactMarkdown>
				</div>

				<Divider />

				<div className={styles.authorSection}>
					<Card>
						<Card.Meta
							avatar={<Avatar src={article.author.avatar} size={64} />}
							title={<Title level={4}>{article.author.name}</Title>}
							description={article.author.bio}
						/>
					</Card>
				</div>

				{relatedArticles.length > 0 && (
					<div className={styles.relatedSection}>
						<Title level={3}>Bài viết liên quan</Title>
						<Row gutter={[24, 24]}>
							{relatedArticles.map((relArticle) => (
								<Col xs={24} sm={12} md={8} key={relArticle.id}>
									<Card
										hoverable
										className={styles.relatedCard}
										cover={<img alt={relArticle.title} src={relArticle.thumbnail || 'https://via.placeholder.com/300x200'} />}
										onClick={() => history.push(`/blog/post/${relArticle.id}`)}
									>
										<Title level={5} ellipsis={{ rows: 2 }}>{relArticle.title}</Title>
										<Paragraph type="secondary" ellipsis={{ rows: 2 }}>
											{relArticle.summary}
										</Paragraph>
									</Card>
								</Col>
							))}
						</Row>
					</div>
				)}
			</div>
		</div>
	);
};

export default ArticleDetail;
