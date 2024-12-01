import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, ButtonGroup, Button, Popover, PopoverBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

const activityColors = {
  'Jogging': '#FF4B4B',
  'Zumba': '#4B83FF',
  'Spinning': '#4BFF4B',
  'Yoga': '#FFB74B',
  'Gym training': '#9B4BFF',
  'Fitness': '#ff1493',
  'Running': '#006400',
  'Dancing': '#8b008b'
};

const CalendarView = () => {
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('dayGridMonth');
  const [popoverEvent, setPopoverEvent] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gettrainings`);
      const data = await response.json();
      setTrainings(data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const calendarEvents = trainings.map(training => {
    return {
      id: training.id,
      title: `${training.activity} - ${training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'Asiakas ei määritelty'}`,
      start: training.date,
      end: new Date(new Date(training.date).getTime() + training.duration * 60000),
      backgroundColor: activityColors[training.activity] || activityColors.default,
      borderColor: activityColors[training.activity] || activityColors.default,
      extendedProps: {
        activity: training.activity,
        customerName: training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'Asiakas ei määritelty',
        duration: training.duration
      }
    };
  });

  const handleEventClick = (clickInfo) => {
    setPopoverEvent({
      ...clickInfo.event,
      target: clickInfo.el
    });
  };

  const togglePopover = () => {
    setPopoverEvent(null);
  };

  
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-container p-4 text-center">
            <h3>Oops! Jotain meni pieleen.</h3>
            <Button color="primary" onClick={() => window.location.reload()}>
              Lataa sivu uudelleen
            </Button>
          </div>
        );
      }
      return this.props.children;
    }
  }

  return (
    <ErrorBoundary>
      <div className="calendar-container" style={{ padding: '20px' }}>
        <Card className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Harjoituskalenteri</h1>
            <div>
              <div className="activity-legend d-flex gap-2 mb-3">
                {Object.entries(activityColors).map(([activity, color]) => (
                  activity !== 'default' && (
                    <div key={activity} className="d-flex align-items-center">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: color,
                          marginRight: '5px',
                          borderRadius: '4px'
                        }}
                      />
                      <span>{activity}</span>
                    </div>
                  )
                ))}
              </div>
              <ButtonGroup>
                <Button 
                  color={view === 'timeGridDay' ? 'primary' : 'secondary'}
                  onClick={() => setView('timeGridDay')}
                >
                  Päivä
                </Button>
                <Button 
                  color={view === 'timeGridWeek' ? 'primary' : 'secondary'}
                  onClick={() => setView('timeGridWeek')}
                >
                  Viikko
                </Button>
                <Button 
                  color={view === 'dayGridMonth' ? 'primary' : 'secondary'}
                  onClick={() => setView('dayGridMonth')}
                >
                  Kuukausi
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            events={calendarEvents}
            locale="fi"
            height="auto"
            aspectRatio={1.5}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            eventClick={handleEventClick}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </Card>

        {popoverEvent && (
          <Popover
            placement="auto"
            isOpen={true}
            target={popoverEvent.target}
            toggle={togglePopover}
          >
            <PopoverBody>
              <h5>{popoverEvent.extendedProps.activity}</h5>
              <p>Asiakas: {popoverEvent.extendedProps.customerName}</p>
              <p>Kesto: {popoverEvent.extendedProps.duration} min</p>
              <p>Aika: {new Date(popoverEvent.start).toLocaleTimeString('fi-FI')}</p>
            </PopoverBody>
          </Popover>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CalendarView;