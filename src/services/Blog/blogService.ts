export interface ITag {
	id: string;
	name: string;
	articleCount: number;
}

export interface IAuthor {
	name: string;
	avatar: string;
	bio: string;
	skills: string[];
	social: {
		github?: string;
		facebook?: string;
		linkedin?: string;
	};
}

export interface IArticle {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	thumbnail: string;
	tags: string[]; // tag ids
	status: 'draft' | 'published';
	views: number;
	createdAt: string;
	author: IAuthor;
}

const STORAGE_KEYS = {
	ARTICLES: 'blog_articles',
	TAGS: 'blog_tags',
	AUTHOR: 'blog_author',
};

const defaultAuthor: IAuthor = {
	name: 'Nguyễn Văn A',
	avatar: 'https://joeschmoe.io/api/v1/random',
	bio: 'Một lập trình viên đam mê công nghệ và chia sẻ kiến thức. Tôi thích viết code và học hỏi những điều mới mẻ mỗi ngày.',
	skills: ['React', 'TypeScript', 'UmiJS', 'Ant Design', 'Node.js'],
	social: {
		github: 'https://github.com',
		facebook: 'https://facebook.com',
		linkedin: 'https://linkedin.com',
	},
};

const defaultTags: ITag[] = [
	{ id: 't1', name: 'React', articleCount: 2 },
	{ id: 't2', name: 'UmiJS', articleCount: 1 },
	{ id: 't3', name: 'JavaScript', articleCount: 1 },
	{ id: 't4', name: 'Web Development', articleCount: 2 },
];

const defaultArticles: IArticle[] = [
	{
		id: 'a1',
		title: 'Hướng dẫn sử dụng React Hooks cơ bản',
		slug: 'huong-dan-su-dung-react-hooks-co-ban',
		summary: 'Tìm hiểu về các hooks cơ bản trong React như useState, useEffect, useContext...',
		content: `
# React Hooks là gì?
Hooks là một tính năng mới trong React 16.8. Nó cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class.

## useState
\`\`\`jsx
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã bấm {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Bấm vào đây
      </button>
    </div>
  );
}
\`\`\`
`,
		thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
		tags: ['t1', 't3', 't4'],
		status: 'published',
		views: 154,
		createdAt: new Date().toISOString(),
		author: defaultAuthor,
	},
	{
		id: 'a2',
		title: 'Xây dựng ứng dụng với UmiJS và Ant Design Pro',
		slug: 'xay-dung-ung-dung-voi-umijs-ant-design-pro',
		summary: 'Bài viết này sẽ hướng dẫn cách khởi tạo và cấu hình một dự án sử dụng UmiJS kết hợp cùng Ant Design Pro.',
		content: `
# Giới thiệu UmiJS
Umi là một framework ứng dụng frontend dành cho doanh nghiệp, dựa trên React.

## Tại sao chọn UmiJS?
- Extensible
- Out-of-the-box
- Enterprise-class
		`,
		thumbnail: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
		tags: ['t1', 't2', 't4'],
		status: 'published',
		views: 320,
		createdAt: new Date(Date.now() - 86400000).toISOString(),
		author: defaultAuthor,
	},
	{
		id: 'a3',
		title: 'Bản nháp: Tìm hiểu về TypeScript',
		slug: 'tim-hieu-ve-typescript',
		summary: 'Một số ghi chép cá nhân về TypeScript.',
		content: 'Đang viết...',
		thumbnail: '',
		tags: ['t3'],
		status: 'draft',
		views: 0,
		createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
		author: defaultAuthor,
	},
];

// Initialize localStorage if empty
if (typeof window !== 'undefined') {
	if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(defaultTags));
	}
	if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
		localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(defaultArticles));
	}
	if (!localStorage.getItem(STORAGE_KEYS.AUTHOR)) {
		localStorage.setItem(STORAGE_KEYS.AUTHOR, JSON.stringify(defaultAuthor));
	}
}

// Helper to delay (simulate API network)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const blogService = {
	async getTags(): Promise<ITag[]> {
		await delay(200);
		return JSON.parse(localStorage.getItem(STORAGE_KEYS.TAGS) || '[]');
	},
	async saveTags(tags: ITag[]): Promise<void> {
		await delay(200);
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
	},
	async addTag(tag: Omit<ITag, 'id' | 'articleCount'>): Promise<ITag> {
		const tags = await this.getTags();
		const newTag = { ...tag, id: 't' + Date.now(), articleCount: 0 };
		tags.push(newTag);
		await this.saveTags(tags);
		return newTag;
	},
	async updateTag(id: string, name: string): Promise<void> {
		const tags = await this.getTags();
		const index = tags.findIndex(t => t.id === id);
		if (index > -1) {
			tags[index].name = name;
			await this.saveTags(tags);
		}
	},
	async deleteTag(id: string): Promise<void> {
		let tags = await this.getTags();
		tags = tags.filter(t => t.id !== id);
		await this.saveTags(tags);
	},

	async getArticles(): Promise<IArticle[]> {
		await delay(300);
		return JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
	},
	async getPublishedArticles(): Promise<IArticle[]> {
		const articles = await this.getArticles();
		return articles.filter(a => a.status === 'published').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	},
	async getArticleById(id: string): Promise<IArticle | null> {
		const articles = await this.getArticles();
		return articles.find(a => a.id === id) || null;
	},
	async saveArticles(articles: IArticle[]): Promise<void> {
		await delay(300);
		localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
		// Recalculate tag counts
		const tags = await this.getTags();
		const tagCounts: Record<string, number> = {};
		articles.forEach(a => {
			a.tags.forEach(tid => {
				tagCounts[tid] = (tagCounts[tid] || 0) + 1;
			});
		});
		tags.forEach(t => {
			t.articleCount = tagCounts[t.id] || 0;
		});
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
	},
	async incrementViewCount(id: string): Promise<void> {
		const articles = await this.getArticles();
		const index = articles.findIndex(a => a.id === id);
		if (index > -1) {
			articles[index].views += 1;
			localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
		}
	},
	async addArticle(articleData: Partial<IArticle>): Promise<void> {
		const articles = await this.getArticles();
		const newArticle: IArticle = {
			...articleData,
			id: 'a' + Date.now(),
			createdAt: new Date().toISOString(),
			views: 0,
			author: JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTHOR) || '{}'),
		} as IArticle;
		articles.push(newArticle);
		await this.saveArticles(articles);
	},
	async updateArticle(id: string, articleData: Partial<IArticle>): Promise<void> {
		const articles = await this.getArticles();
		const index = articles.findIndex(a => a.id === id);
		if (index > -1) {
			articles[index] = { ...articles[index], ...articleData };
			await this.saveArticles(articles);
		}
	},
	async deleteArticle(id: string): Promise<void> {
		let articles = await this.getArticles();
		articles = articles.filter(a => a.id !== id);
		await this.saveArticles(articles);
	},

	async getAuthor(): Promise<IAuthor> {
		await delay(100);
		return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTHOR) || '{}');
	}
};
