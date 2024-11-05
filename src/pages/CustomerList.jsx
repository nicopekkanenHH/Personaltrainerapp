import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const CustomerList = ({ onCustomerAdd }) => {
  const [customers, setCustomers] = useState([]);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');

  useEffect(() => {
    const fetchedCustomers = [
      { id: 1, name: 'Mikko Manninen', email: 'mikko@example.com', phone: '0401234567' },
      { id: 2, name: 'Siiri Pekkanen', email: 'siiri@example.com', phone: '0402345678' },
      { id: 3, name: 'Johanna Oksanen', email: 'johanna@example.com', phone: '0403456789' },
      { id: 4, name: 'Ida Katka', email: 'ida@example.com', phone: '0404567890' },
      { id: 5, name: 'Joona Olenius', email: 'joona@example.com', phone: '0405678901' },
    ];
    setCustomers(fetchedCustomers);
  }, []);

  const columnDefs = [
    { headerName: "Nimi", field: "name", sortable: true, filter: true },
    { headerName: "Sähköposti", field: "email", sortable: true, filter: true },
    { headerName: "Puhelin", field: "phone", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div>
          <Button color="warning" onClick={() => {
            setEditCustomerId(params.data.id);
            setEditCustomerName(params.data.name);
            setEditCustomerEmail(params.data.email);
            setEditCustomerPhone(params.data.phone);
            setShowEditModal(true);
          }}>
            Muokkaa
          </Button>
          <Button color="danger" onClick={() => {
            setDeleteCustomerId(params.data.id);
            setShowDeleteModal(true);
          }}>
            Poista
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    setCustomers(customers.filter(customer => customer.id !== deleteCustomerId));
    setShowDeleteModal(false);
  };

  const handleAdd = () => {
    const newCustomer = {
      id: Date.now(), 
      name: newCustomerName,
      email: newCustomerEmail,
      phone: newCustomerPhone,
    };
    setCustomers([...customers, newCustomer]);
    onCustomerAdd(newCustomer); 
    setShowAddModal(false);
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
  };

  const handleEdit = () => {
    const updatedCustomers = customers.map(customer =>
      customer.id === editCustomerId
        ? { ...customer, name: editCustomerName, email: editCustomerEmail, phone: editCustomerPhone }
        : customer
    );
    setCustomers(updatedCustomers);
    setShowEditModal(false);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Asiakkaat</h1>
      <Button color="primary" onClick={() => setShowAddModal(true)}>Lisää Uusi Asiakas</Button>
      <AgGridReact
        rowData={customers}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />

      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(!showDeleteModal)}>
        <ModalHeader>Vahvista poisto</ModalHeader>
        <ModalBody>
          Haluatko varmasti poistaa tämän asiakkaan?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Poista</Button>
          <Button onClick={() => setShowDeleteModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(!showAddModal)}>
        <ModalHeader>Uusi Asiakas</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="name">Nimi</Label>
              <Input
                type="text"
                id="name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                type="email"
                id="email"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Puhelin</Label>
              <Input
                type="tel"
                id="phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAdd}>Tallenna</Button>
          <Button color="secondary" onClick={() => setShowAddModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showEditModal} toggle={() => setShowEditModal(!showEditModal)}>
        <ModalHeader>Muokkaa Asiakasta</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="name">Nimi</Label>
              <Input
                type="text"
                id="name"
                value={editCustomerName}
                onChange={(e) => setEditCustomerName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                type="email"
                id="email"
                value={editCustomerEmail}
                onChange={(e) => setEditCustomerEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Puhelin</Label>
              <Input
                type="tel"
                id="phone"
                value={editCustomerPhone}
                onChange={(e) => setEditCustomerPhone(e.target.value)}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEdit}>Tallenna</Button>
          <Button color="secondary" onClick={() => setShowEditModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomerList;
