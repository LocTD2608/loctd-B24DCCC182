export default [
	{
		name: 'Đăng nhập',
		path: '/quan-ly-cong-viec',
		icon: 'ProjectOutlined',
		hideInMenu: true,
		routes: [
			{
				path: '/quan-ly-cong-viec/dang-nhap',
				name: 'Đăng nhập',
				component: './QuanLyCongViec/DangNhap',
				layout: false,
			},
		],
	},
	{
		path: '/danh-sach-cong-viec',
		name: 'Danh sách công việc',
		component: './TodoList',
		icon: 'CheckSquareOutlined',
	},
	{
		path: '/my-tasks',
		name: 'Công việc của tôi',
		icon: 'UserOutlined',
		component: './MyTasks',
	},
	{
		path: '/calendar',
		name: 'Lịch công việc',
		icon: 'CalendarOutlined',
		component: './CalendarView',
	},
	{
		path: '/statistics',
		name: 'Thống kê & Báo cáo',
		component: './statistics',
		icon: 'AreaChartOutlined',
	},
	{
		path: '/',
		redirect: '/quan-ly-cong-viec/dang-nhap',
	},
	{
		component: './exception/404',
	},
];
