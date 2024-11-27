import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

const CustomerList = ({ onCustomerAdd }) => {
  const [customers, setCustomers] = useState([]);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      console.log('Raw customer data:', data);

      const processedCustomers = data._embedded.customers.map(customer => {
        // Otetaan ID linkistä
        const selfLink = customer._links.self.href;
        const id = selfLink.split('/').pop(); // Otetaan viimeinen osa URL:sta
        return { ...customer, id };
      });

      setCustomers(processedCustomers);  // Turvallinen tarkistus
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Aseta tyhjä lista virheen tapahtuessa
    }
  };

  // Yhdistetty lomakekenttä renderöinti
  const renderInput = (id, label, type = 'text') => (
    <FormGroup>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
        required
      />
    </FormGroup>
  );

  const columnDefs = [
    { 
      headerName: "Nimi", 
      valueGetter: params => `${params.data.firstname} ${params.data.lastname}`,
      sortable: true, 
      filter: true 
    },
    { headerName: "Sähköposti", field: "email", sortable: true, filter: true },
    { headerName: "Puhelin", field: "phone", sortable: true, filter: true },
    { headerName: "Osoite", field: "streetaddress", sortable: true, filter: true },
    { headerName: "Postinumero", field: "postcode", sortable: true, filter: true },
    { headerName: "Kaupunki", field: "city", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        console.log('Row data in cell renderer:', params.data);
        return (
          <div>
            <Button color="warning" onClick={() => {
              const customer = params.data;
              setEditCustomerId(customer.id);
              setFormData({
                firstname: customer.firstname,
                lastname: customer.lastname,
                email: customer.email,
                phone: customer.phone,
                streetaddress: customer.streetaddress,
                postcode: customer.postcode,
                city: customer.city,
              });
              setShowEditModal(true);
            }}>
              Muokkaa
            </Button>
            {' '}
            <Button color="danger" onClick={() => {
              const customer = params.data;
              setDeleteCustomerId(customer.id);
              setShowDeleteModal(true);
            }}>
              Poista
            </Button>
          </div>
        );
      }
    }
  ];

  const handleDelete = async () => {
    try {
      if (!deleteCustomerId) {
        console.error('No customer ID provided for deletion');
        return;
      }
      
      console.log('Attempting to delete customer with ID:', deleteCustomerId);
      
      const response = await fetch(`${API_BASE_URL}/customers/${deleteCustomerId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchCustomers();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newCustomer = await response.json();
      await fetchCustomers();
      if (onCustomerAdd) onCustomerAdd(newCustomer);
      setShowAddModal(false);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: ''
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleEdit = async () => {
    try {
      if (!editCustomerId) {
        console.error('No customer ID provided for editing');
        return;
      }
      
      console.log('Attempting to edit customer with ID:', editCustomerId);
      console.log('Form data:', formData);
      
      const response = await fetch(`${API_BASE_URL}/customers/${editCustomerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await fetchCustomers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const exportToCSV = () => {
    const exportData = customers.map(({ firstname, lastname, email, phone }) => ({
      name: `${firstname} ${lastname}`,  // Yhdistetään firstname ja lastname
      email,
      phone
    }));

    const headers = ['Nimi,Sähköposti,Puhelin\n'];
    const csv = exportData.map(row => 
      `${row.name},${row.email},${row.phone}`
    ).join('\n');

    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `asiakkaat_${new Date().toLocaleDateString()}.csv`);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Asiakkaat</h1>
      <Button color="success" onClick={exportToCSV} style={{ marginRight: '1rem' }}>
         Vie CSV 
      </Button>
      <Button color="primary" onClick={() => setShowAddModal(true)}>Lisää Uusi Asiakas</Button>
      <AgGridReact
        rowData={customers}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />

      {/* Poistomodaali */}
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

      {/* Lisää asiakas */}
      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(!showAddModal)}>
        <ModalHeader>Uusi Asiakas</ModalHeader>
        <ModalBody>
          <Form>
            {renderInput("firstname", "Etunimi")}
            {renderInput("lastname", "Sukunimi")}
            {renderInput("email", "Sähköposti", "email")}
            {renderInput("phone", "Puhelin", "tel")}
            {renderInput("streetaddress", "Osoite")}
            {renderInput("postcode", "Postinumero")}
            {renderInput("city", "Kaupunki")}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAdd}>Tallenna</Button>
          <Button color="secondary" onClick={() => setShowAddModal(false)}>Peruuta</Button>
        </ModalFooter>
      </Modal>

      {/* Muokkaa asiakasta */}
      <Modal isOpen={showEditModal} toggle={() => setShowEditModal(!showEditModal)}>
        <ModalHeader>Muokkaa Asiakasta</ModalHeader>
        <ModalBody>
          <Form>
            {renderInput("firstname", "Etunimi")}
            {renderInput("lastname", "Sukunimi")}
            {renderInput("email", "Sähköposti", "email")}
            {renderInput("phone", "Puhelin", "tel")}
            {renderInput("streetaddress", "Osoite")}
            {renderInput("postcode", "Postinumero")}
            {renderInput("city", "Kaupunki")}
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