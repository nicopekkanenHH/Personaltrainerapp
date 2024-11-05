import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchedTrainings = [
      { id: 1, date: dayjs().subtract(1, 'day').hour(9).minute(30).toDate(), activity: "Juoksu", customerName: "Matti Meikäläinen" },
      { id: 2, date: dayjs().subtract(2, 'day').hour(14).minute(0).toDate(), activity: "Uinti", customerName: "Liisa Virtanen" },
      { id: 3, date: dayjs().subtract(1, 'week').hour(16).minute(45).toDate(), activity: "Kuntosali", customerName: "Antti Jokinen" },
      { id: 4, date: dayjs().subtract(3, 'day').hour(11).minute(15).toDate(), activity: "Jooga", customerName: "Johanna Korhonen" },
      { id: 5, date: dayjs().hour(10).minute(0).toDate(), activity: "Pyöräily", customerName: "Kalle Laine" },
      { id: 6, date: dayjs().add(1, 'day').hour(17).minute(30).toDate(), activity: "Kävely", customerName: "Sari Hämäläinen" },
      { id: 7, date: dayjs().add(2, 'day').hour(8).minute(45).toDate(), activity: "Tanssi", customerName: "Pekka Nieminen" },
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
    { headerName: "Asiakkaan nimi", field: "customerName", sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>Harjoitukset</h1>
      <AgGridReact
        rowData={trainings}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default TrainingList;