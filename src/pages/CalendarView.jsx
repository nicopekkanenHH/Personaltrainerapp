import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, ButtonGroup, Button, Popover, PopoverBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const activityColors = {
  'Juoksu': '#FF4B4B',
  'Uinti': '#4B83FF',
  'Pyöräily': '#4BFF4B',
  'Jooga': '#FFB74B',
  'Voimaharjoittelu': '#9B4BFF',
  'default': '#007bff'
};

const CalendarView = () => {
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('dayGridMonth');
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchedCustomers = [
      { id: 1, name: 'Mikko Manninen' },
      { id: 2, name: 'Siiri Pekkanen' },
      { id: 3, name: 'Johanna Oksanen'},
      { id: 4, name: 'Ida Katka'},
      { id: 5, name: 'Joona Olenius'},
    ];
    
    const fetchedTrainings = [
      { id: 1, date: "2024-11-20T10:00:00", activity: 'Juoksu', customerId: 1, duration: 60 },
      { id: 2, date: "2024-11-15T12:00:00", activity: 'Uinti', customerId: 2, duration: 60},
      { id: 3, date: "2024-11-17T15:00:00", activity: 'Pyöräily', customerId: 3, duration: 45},
      { id: 4, date: "2024-11-11T11:00:00", activity: 'Jooga', customerId: 4, duration: 30},
      { id: 5, date: "2024-11-27T13:00:00", activity: 'Voimaharjoittelu', customerId: 5, duration: 40 }
    ];
    
    setCustomers(fetchedCustomers);
    setTrainings(fetchedTrainings);
  }, []);

  
  const calendarEvents = trainings.map(training => {
    const customer = customers.find(c => c.id === training.customerId);
    return {
      id: training.id,
      title: `${training.activity} - ${customer?.name || 'Asiakas'}`,
      start: training.date,
      end: new Date(new Date(training.date).getTime() + training.duration * 60 * 1000),
      backgroundColor: activityColors[training.activity] || activityColors.default,
      borderColor: activityColors[training.activity] || activityColors.default,
      extendedProps: {
        activity: training.activity,
        customerName: customer?.name,
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