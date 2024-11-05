import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Simuloitu asiakastietokanta useilla asiakastiedoilla
    const fetchedCustomers = [
      { id: 1, name: "Matti Meikäläinen", email: "matti@example.com", phone: "1234567890" },
      { id: 2, name: "Liisa Virtanen", email: "liisa@example.com", phone: "0987654321" },
      { id: 3, name: "Antti Jokinen", email: "antti@example.com", phone: "4561237890" },
      { id: 4, name: "Johanna Korhonen", email: "johanna@example.com", phone: "3216549870" },
      { id: 5, name: "Kalle Laine", email: "kalle@example.com", phone: "7896541230" },
      { id: 6, name: "Sari Hämäläinen", email: "sari@example.com", phone: "6543210987" },
      { id: 7, name: "Pekka Nieminen", email: "pekka@example.com", phone: "1237894560" },
    ];
    setCustomers(fetchedCustomers);
  }, []);

  const columnDefs = [
    { headerName: "Nimi", field: "name", sortable: true, filter: true },
    { headerName: "Sähköposti", field: "email", sortable: true, filter: true },
    { headerName: "Puhelin", field: "phone", sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Asiakkaat</h1>
      <AgGridReact
        rowData={customers}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default CustomerList;