import React, { useState } from 'react';
import { View } from 'react-native';
import { DataTable } from 'react-native-paper';

const CollectionOfflineTable = ({ collectionsOffline }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;

  const handlePageChange = (page) => {
    setPage(page);
  };

  const paginatedData = collectionsOffline.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 1 }}>Shift</DataTable.Title>
          <DataTable.Title style={{ flex: 2 }}>Name</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>Qty</DataTable.Title>
          <DataTable.Title style={{ flex: 2 }}>Date</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>Amt</DataTable.Title>
        </DataTable.Header>

        {paginatedData.map((collection, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell style={{ flex: 1 }}>
              {collection.shift === 'Evening' ? 'E' : 'M'}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>{collection.farmerName}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>{collection.qty}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
              {new Date(collection.collectionDate).toLocaleString()}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>{collection.amount}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(collectionsOffline.length / itemsPerPage)}
          onPageChange={handlePageChange}
          label={`${page + 1} of ${Math.ceil(
            collectionsOffline.length / itemsPerPage
          )}`}
        />
      </DataTable>
    </View>
  );
};

export default CollectionOfflineTable;
