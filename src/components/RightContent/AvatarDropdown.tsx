import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { history } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const fullName = localStorage.getItem('username') || 'Tài khoản';
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const loginOut = () => {
		localStorage.removeItem('username');
		history.replace('/quan-ly-cong-viec/dang-nhap');
	};

	const items: ItemType[] = [
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: loginOut,
			danger: true,
		},
	];

	return (
		<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
			<span className={`${styles.action} ${styles.account}`}>
				<Avatar
					className={styles.avatar}
					icon={lastNameChar ?? <UserOutlined />}
					alt='avatar'
				/>
				<span className={`${styles.name}`}>{fullName}</span>
			</span>
		</HeaderDropdown>
	);
};

export default AvatarDropdown;
