import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deleteTrainingId, setDeleteTrainingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Harjoitustyypit
  const activityOptions = [
    { value: 'Jogging', label: 'Jogging' },
    { value: 'Yoga', label: 'Yoga' },
    { value: 'Gym training', label: 'Gym training' },
    { value: 'Spinning', label: 'Spinning' },
    { value: 'Zumba', label: 'Zumba' },
    { value: 'Running', label: 'Running' },
    { value: 'Dancing', label: 'Dancing' },
    { value: 'Fitness', label: 'Fitness' },
  ];

  const [newTraining, setNewTraining] = useState({
    date: new Date(),
    activity: null, // Muutettu: valinta dropdownista
    duration: '',
    customer: null, // Muutettu: asiakas valitaan dropdownista
  });

  useEffect(() => {
    fetchTrainings();
    fetchCustomers();
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

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data._embedded.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/trainings/${deleteTrainingId}`, {
        method: 'DELETE',
      });
      await fetchTrainings(); // Päivitä harjoituslista
      setShowDeleteModal(false); // Sulje modal
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  const handleAdd = async () => {
    if (!newTraining.customer) {
      console.error('Asiakas on valittava!');
      alert('Valitse asiakas ennen tallennusta.');
      return;
    }
    if (!newTraining.activity) {
      console.error('Aktiviteetti on valittava!');
      alert('Valitse aktiviteetti ennen tallennusta.');
      return;
    }

    try {
      const trainingData = {
        date: newTraining.date.toISOString(),
        activity: newTraining.activity.value, // Dropdownin valinnan arvo
        duration: parseInt(newTraining.duration),
        customer: newTraining.customer.value
      };

      await fetch(`${API_BASE_URL}/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      await fetchTrainings(); // Päivitetään lista
      setShowAddModal(false);
      setNewTraining({
        date: new Date(),
        activity: null,
        duration: '',
        customer: null,
      });
    } catch (error) {
      console.error('Error adding training:', error);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Harjoitukset</h1>
      <Button color="primary" onClick={() => setShowAddModal(true)}>Lisää Uusi Harjoitus</Button>
      <AgGridReact
        rowData={trainings}
        columnDefs={[
          {
            headerName: "Päivämäärä",
            field: "date",
            valueFormatter: ({ value }) => dayjs(value).format("DD.MM.YYYY HH:mm"),
            sortable: true,
            filter: true,
          },
          { headerName: "Aktiviteetti", field: "activity", sortable: true, filter: true },
          { headerName: "Kesto (min)", field: "duration", sortable: true, filter: true },
          {
            headerName: "Asiakas",
            valueGetter: params => {
              const customer = params.data.customer;
              if (customer && params.data.customer.id &&
                params.data.customer.firstname && 
                params.data.customer.lastname) {
              return `${params.data.customer.firstname} ${params.data.customer.lastname}`;
            }
            
            return 'Asiakas ei määritelty';
          },
            sortable: true,
            filter: true,
          },
          {
            headerName: "Toiminnot",
            field: "actions",
            cellRenderer: (params) => (
              <div>
                <Button color="danger" onClick={() => {
                  setDeleteTrainingId(params.data.id);
                  setShowDeleteModal(true);
                }}>
                  Poista
                </Button>
              </div>
            ),
          },
        ]}
        pagination={true}
        paginationPageSize={20}
      />

      {/* Poistomodaali */}
      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(!showDeleteModal)}>
        <ModalHeader>Vahvista poisto</ModalHeader>
        <ModalBody>Haluatko varmasti poistaa tämän harjoituksen?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Poista</Button>
          <Button onClick={() => setShowDeleteModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>

      {/* Lisää uusi harjoitus */}
      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(!showAddModal)}>
        <ModalHeader>Uusi Harjoitus</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="date">Päivämäärä</Label>
              <DatePicker
                id="date"
                selected={newTraining.date}
                onChange={(newDate) => setNewTraining({ ...newTraining, date: newDate })}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="dd.MM.yyyy HH:mm"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="activity">Aktiviteetti</Label>
              <Select
                id="activity"
                options={activityOptions}
                onChange={(selectedOption) => setNewTraining({ ...newTraining, activity: selectedOption })}
                placeholder="Valitse aktiviteetti"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="duration">Kesto (min)</Label>
              <Input
                type="number"
                id="duration"
                value={newTraining.duration}
                onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="customerName">Asiakkaan nimi</Label>
              <Select
                id="customerName"
                options={customers.map(customer => ({
                  value: customer.id,
                  label: `${customer.firstname} ${customer.lastname}`
                }))}
                onChange={(selectedOption) => 
                  setNewTraining({ ...newTraining, customer: selectedOption })} 
                placeholder="Valitse asiakas"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAdd}>Tallenna</Button>
          <Button onClick={() => setShowAddModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TrainingList;