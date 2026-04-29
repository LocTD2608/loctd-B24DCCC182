import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Pagination, Tag, Input, Spin, Typography, Space } from 'antd';
import { ClockCircleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import debounce from 'lodash/debounce';
import { blogService, IArticle, ITag } from '@/services/Blog/blogService';
import styles from './index.less';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const PAGE_SIZE = 9;

const BlogHome: React.FC = () => {
	const [allArticles, setAllArticles] = useState<IArticle[]>([]);
	const [tags, setTags] = useState<ITag[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [articlesRes, tagsRes] = await Promise.all([
					blogService.getPublishedArticles(),
					blogService.getTags(),
				]);
				setAllArticles(articlesRes);
				setTags(tagsRes);
			} catch (error) {
				console.error('Failed to fetch blog data', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Lọc bài viết
	const filteredArticles = useMemo(() => {
		let result = allArticles;

		if (selectedTag) {
			result = result.filter((article) => article.tags.includes(selectedTag));
		}

		if (searchTerm) {
			const lowerSearch = searchTerm.toLowerCase();
			result = result.filter((article) =>
				(article.title || '').toLowerCase().includes(lowerSearch) ||
				(article.summary || '').toLowerCase().includes(lowerSearch)
			);
		}

		return result;
	}, [allArticles, selectedTag, searchTerm]);

	// Phân trang
	const paginatedArticles = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredArticles.slice(start, start + PAGE_SIZE);
	}, [filteredArticles, currentPage]);

	// Handle search (debounce)
	const handleSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearchTerm(value);
				setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
			}, 300),
		[],
	);

	const handleTagClick = (tagId: string) => {
		setSelectedTag(prev => (prev === tagId ? null : tagId));
		setCurrentPage(1);
	};

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const renderTags = (articleTags: string[]) => {
		return articleTags.map(tid => {
			const tagObj = tags.find(t => t.id === tid);
			if (!tagObj) return null;
			return (
				<Tag color="blue" key={tid} className={styles.tagBadge}>
					{tagObj.name}
				</Tag>
			);
		});
	};

	return (
		<div className={styles.blogHomeContainer}>
			<div className={styles.heroSection}>
				<Title className={styles.heroTitle}>Khám phá góc nhìn mới</Title>
				<Paragraph className={styles.heroSubtitle}>
					Chia sẻ kiến thức, kinh nghiệm và những điều thú vị về lập trình.
				</Paragraph>
				<Search
					placeholder="Tìm kiếm bài viết..."
					allowClear
					size="large"
					onChange={(e) => handleSearch(e.target.value)}
					className={styles.searchBar}
				/>
			</div>

			<div className={styles.mainContent}>
				<Row gutter={[32, 32]}>
					<Col xs={24} lg={18}>
						<Spin spinning={loading}>
							<Row gutter={[24, 24]}>
								{paginatedArticles.length > 0 ? (
									paginatedArticles.map((article) => (
										<Col xs={24} sm={12} md={8} key={article.id}>
											<Card
												hoverable
												className={styles.articleCard}
												cover={
													<div className={styles.coverWrapper}>
														<img alt={article.title} src={article.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'} />
													</div>
												}
												onClick={() => history.push(`/blog/post/${article.id}`)}
											>
												<div className={styles.cardTags}>
													{renderTags(article.tags)}
												</div>
												<Title level={4} className={styles.cardTitle} ellipsis={{ rows: 2 }}>
													{article.title}
												</Title>
												<Paragraph className={styles.cardSummary} ellipsis={{ rows: 3 }}>
													{article.summary}
												</Paragraph>
												<div className={styles.cardMeta}>
													<Space>
														<UserOutlined /> {article.author.name}
													</Space>
													<Space>
														<ClockCircleOutlined /> {formatDate(article.createdAt)}
													</Space>
													<Space>
														<EyeOutlined /> {article.views}
													</Space>
												</div>
											</Card>
										</Col>
									))
								) : (
									<Col span={24}>
										<div className={styles.emptyState}>
											<p>Không tìm thấy bài viết nào phù hợp.</p>
										</div>
									</Col>
								)}
							</Row>
							{filteredArticles.length > PAGE_SIZE && (
								<div className={styles.paginationWrapper}>
									<Pagination
										current={currentPage}
										pageSize={PAGE_SIZE}
										total={filteredArticles.length}
										onChange={(page) => setCurrentPage(page)}
										showSizeChanger={false}
									/>
								</div>
							)}
						</Spin>
					</Col>

					<Col xs={24} lg={6}>
						<Card title="Khám phá theo thẻ" className={styles.sidebarCard}>
							<div className={styles.sidebarTags}>
								{tags.map((tag) => (
									<Tag
										key={tag.id}
										className={selectedTag === tag.id ? styles.tagActive : styles.tagNormal}
										onClick={() => handleTagClick(tag.id)}
									>
										{tag.name} ({tag.articleCount})
									</Tag>
								))}
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default BlogHome;
