  import {Table,Thead,Tbody,Tfoot,Tr,Th,Td,TableCaption,TableContainer,IconButton,Input,Select,Box,Flex,Button} from '@chakra-ui/react';
  import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
  import React, { useState } from 'react';
  import DownloadCSV from '../utils/DownloadCSV';
  import {Item} from "../types"


  // Sample data
  const initialData: Item[] = [
    { id: 1, name: 'License A', expiryDate: '2024-12-31', createdBy: 'Mujeeb', vendor: 'Feitian', category: 'PAM', status: 'Up to Date' },
    { id: 2, name: 'License B', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 3, name: 'License C', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 4, name: 'License D', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 5, name: 'License E', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 6, name: 'License F', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 7, name: 'License G', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 8, name: 'License H', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 9, name: 'License I', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    { id: 10, name: 'License J', expiryDate: '2024-11-30', createdBy: 'Ahmed', vendor: 'XYZ', category: 'SAP', status: 'Expired' },
    // More rows...
  ];

  // Define the filters type
  type Filters = {
    name: string;
    vendor: string;
    status: string;
  };

function License() {
  const [data] = useState<Item[]>(initialData); // Do not modify original data
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<keyof Item>('name');
  const [filters, setFilters] = useState<Filters>({ name: '', vendor: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(5); // Items per page

  // Handle sorting
  const handleSort = (field: keyof Item) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    setSortField(field);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to page 1 after filtering
  };

  // Filter data
  const filteredData = data.filter((item: Item) =>
    Object.keys(filters).every((key) => {
      const filterKey = key as keyof Filters;
      const itemValue = item[filterKey] as string;
      return filters[filterKey]
        ? itemValue.toLowerCase().includes(filters[filterKey].toLowerCase())
        : true;
    })
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box className="bottom-container license" display={'flex'} flexDirection={'column'} p={4}>
      <Flex direction="row" mb={4} gap={4} justifyContent={'flex-end'}>
        {/* Filters */}
        <Box mb={2}>
          <Input
            borderRadius={"lg"}
            size={'sm'}
            placeholder="Filter by Title"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </Box>
        <Box mb={2}>
          <Input
            borderRadius={"lg"}
            size={'sm'}
            placeholder="Filter by Vendor"
            name="vendor"
            value={filters.vendor}
            onChange={handleFilterChange}
          />
        </Box>
        <Box mb={4}>
          <Select
            borderRadius={"lg"}
            size={'sm'}
            placeholder="Filter by Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="Up to Date">Up to Date</option>
            <option value="Expired">Expired</option>
          </Select>
        </Box>
        <Box>
          <DownloadCSV data={data} fileName="Licenses" />
        </Box>
      </Flex>
      <TableContainer>
        <Table colorScheme="blue" size="sm" fontSize={'xs'}>
          <TableCaption>Licenses Overview</TableCaption>
          <Thead bg="blue.50">
            <Tr>
              {/* Sortable headers */}
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('name')}>
                Title {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('expiryDate')}>
                Expiry Date {sortField === 'expiryDate' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('createdBy')}>
                Created by {sortField === 'createdBy' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('vendor')}>
                Vendor {sortField === 'vendor' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('category')}>
                Category {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th fontWeight={'bold'} fontSize={'14px'} cursor={'pointer'} onClick={() => handleSort('status')}>
                Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
              </Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentData.map((row) => (
              <Tr key={row.id}>
                <Td>{row.name}</Td>
                <Td>{row.expiryDate}</Td>
                <Td>{row.createdBy}</Td>
                <Td>{row.vendor}</Td>
                <Td>{row.category}</Td>
                <Td>{row.status}</Td>
                <Td>
                  <IconButton
                    mr={2}
                    isRound
                    variant="solid"
                    colorScheme="red"
                    icon={<DeleteIcon boxSize={4} />}
                    aria-label="Delete"
                  />
                  <IconButton
                    isRound
                    variant="solid"
                    colorScheme="blue"
                    icon={<EditIcon boxSize={4} />}
                    aria-label="Edit"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td colSpan={7}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Box>
                    Page {currentPage} of {totalPages}
                  </Box>
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </Flex>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}


export default License;
