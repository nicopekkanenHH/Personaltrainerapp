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

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [deleteTrainingId, setDeleteTrainingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrainingDate, setNewTrainingDate] = useState(new Date());
  const [newTrainingActivity, setNewTrainingActivity] = useState('');
  const [newTrainingCustomerId, setNewTrainingCustomerId] = useState(null); // Asiakkaan ID

  
  useEffect(() => {
    const fetchedCustomers = [
      { id: 1, name: 'Mikko Manninen' },
      { id: 2, name: 'Siiri Pekkanen' },
      { id: 3, name: 'Johanna Oskanen' },
      { id: 4, name: 'Ida Katka' },
      { id: 5, name: 'Joona Olenius' },
    ];
    setCustomers(fetchedCustomers);
    
    const fetchedTrainings = [
      { id: 1, date: new Date(), activity: 'Juoksu', customerId: 1 },
      { id: 2, date: new Date(), activity: 'Uinti', customerId: 2 },
      { id: 3, date: new Date(), activity: 'Pyöräily', customerId: 3 },
      { id: 4, date: new Date(), activity: 'Jooga', customerId: 4 },
      { id: 5, date: new Date(), activity: 'Voimaharjoittelu', customerId: 5 },
    ];
    setTrainings(fetchedTrainings);
  }, []);

  const columnDefs = [
    {
      headerName: "Päivämäärä",
      field: "date",
      valueFormatter: ({ value }) => dayjs(value).format("DD.MM.YYYY HH:mm"),
      sortable: true,
      filter: true,
    },
    { headerName: "Aktiviteetti", field: "activity", sortable: true, filter: true },
    {
      headerName: "Asiakkaan nimi",
      field: "customerId",
      valueGetter: (params) => {
        const customer = customers.find(c => c.id === params.data.customerId);
        return customer ? customer.name : 'Tuntematon';
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
  ];

  const handleDelete = () => {
    console.log(`Deleting training with ID: ${deleteTrainingId}`);
    setTrainings(trainings.filter(training => training.id !== deleteTrainingId));
    setShowDeleteModal(false);
  };

  const handleAdd = () => {
    const newTraining = {
      id: trainings.length + 1,
      date: newTrainingDate,
      activity: newTrainingActivity,
      customerId: newTrainingCustomerId,
    };
    setTrainings([...trainings, newTraining]);
    setShowAddModal(false);
    setNewTrainingDate(new Date());
    setNewTrainingActivity('');
    setNewTrainingCustomerId(null); 
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Harjoitukset</h1>
      <Button color ="primary" onClick={() => setShowAddModal(true)}>Lisää Uusi Harjoitus</Button>
      <AgGridReact
        rowData={trainings}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />

      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(!showDeleteModal)}>
        <ModalHeader>Vahvista poisto</ModalHeader>
        <ModalBody>
          Haluatko varmasti poistaa tämän harjoituksen?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Poista</Button>
          <Button onClick={() => setShowDeleteModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(!showAddModal)}>
        <ModalHeader>Uusi Harjoitus</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="date">Päivämäärä</Label>
              <DatePicker
                id="date"
                selected={newTrainingDate}
                onChange={(newDate) => setNewTrainingDate(newDate)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="dd.MM.yyyy HH:mm"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="activity">Aktiviteetti</Label>
              <Input
                type="text"
                id="activity"
                value={newTrainingActivity}
                onChange={(e) => setNewTrainingActivity(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="customerName">Asiakkaan nimi</Label>
              <Select
                id="customerName"
                options={customers.map(customer => ({
                  value: customer.id,
                  label: customer.name
                }))}
                onChange={(selectedOption) => setNewTrainingCustomerId(selectedOption.value)}
                placeholder="Valitse asiakas"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleAdd}>Tallenna</Button>
          <Button onClick={() => setShowAddModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TrainingList;
