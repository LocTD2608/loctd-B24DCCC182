import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/vi';

moment.locale('vi');
const localizer = momentLocalizer(moment);

const { Title } = Typography;

interface Todo {
    id: number;
    title: string;
    assignee: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const STORAGE_KEY = 'todolist_advanced';

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const todos: Todo[] = JSON.parse(stored);
                const calendarEvents = todos.map(todo => {
                    const date = moment(todo.deadline).toDate();
                    return {
                        id: todo.id,
                        title: `${todo.title} (${todo.assignee})`,
                        start: date,
                        end: date,
                        allDay: true,
                        resource: todo,
                    };
                });
                setEvents(calendarEvents);
            } catch (error) {
                console.error('Lỗi khi tải lịch:', error);
            }
        }
    }, []);

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '#3174ad';
        const status = event.resource.status;
        if (status === 'DONE') backgroundColor = 'green';
        else if (status === 'TODO') backgroundColor = 'gray';

        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card title={<Title level={4}>Lịch công việc theo hạn chót</Title>}>
                <div style={{ height: 600 }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month', 'week', 'agenda']}
                        defaultView="month"
                        eventPropGetter={eventStyleGetter}
                    />
                </div>
            </Card>
        </div>
    );
};

export default CalendarView;
