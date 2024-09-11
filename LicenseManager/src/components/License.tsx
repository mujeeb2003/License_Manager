import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, IconButton, Input, Select, Box, Flex, Button } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLicense, deleteLicense, getLicenses } from '../redux/license/licenseSlice';
import { AppDispatch, type Filters, type License, type licenseForm, type RootState } from '../types';
import LicenseModal from './Modals/LicenseModal';
import { ToastContainer,toast } from 'react-toastify';
import AlertDialogS from './Dialog/AlertDialog';
function License() {
  const { licenses } = useSelector((state: RootState) => state.license);
  const dispatch = useDispatch<AppDispatch>();

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<keyof License>('expiry_date');
  const [filters, setFilters] = useState<Filters>({
    'User.username': '',
    'Category.category_name': '',
    'Vendor.vendor_name': '',
    'Status.status_name': ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getLicenses());
  }, [dispatch]);

  // Handle sorting
  const handleSort = (field: keyof License) => {
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
  const filteredData = licenses.filter((item) =>
    Object.keys(filters).every((key) => {
      const filterKey = key as keyof Filters;
      const itemValue = item[filterKey]?.toLowerCase() || '';
      return filters[filterKey] ? itemValue.includes(filters[filterKey].toLowerCase()) : true;
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = (data:licenseForm)=>{
    console.log(data);
    dispatch(createLicense(data)).then((res)=>{
      if(res.payload.license){
        toast.success("License Added Successfully");
      }
    }).catch((err)=>{
      toast.error(err);
    });
  }
  return (
    <>
      <ToastContainer autoClose={3000} theme="dark"/>
      <Box className="bottom-container license" display={'flex'} flexDirection={'column'} p={4}>
        <Flex justifyContent={'space-between'}  alignItems={'center'} direction={"column"}>
          <h1 style={{ color: 'var(--dark)',fontSize:'30px',fontWeight:'bold' }}>Licenses</h1> 
        
          <Flex direction="row" gap={4} justifyContent={'flex-end'} alignItems={'center'}>
              {/* Filters */}

              <Box>
                <Input
                  borderRadius={'lg'}
                  size={'sm'}
                  placeholder="Filter by user"
                  name="User.username"
                  value={filters['User.username']}
                  onChange={handleFilterChange}
                />
              </Box>
              <Box>
                <Input
                  borderRadius={'lg'}
                  size={'sm'}
                  placeholder="Filter by Vendor"
                  name="Vendor.vendor_name"
                  value={filters['Vendor.vendor_name']}
                  onChange={handleFilterChange}
                />
              </Box>
              <Box>
                <Select
                  borderRadius={'lg'}
                  size={'sm'}
                  placeholder="Filter by Status"
                  name="Status.status_name"
                  value={filters['Status.status_name']}
                  onChange={handleFilterChange}
                >
                  <option value="Up to Date">Up to Date</option>
                  <option value="Near to Expiry">Near to Expiry</option>
                  <option value="Expired">Expired</option>
                </Select>
              </Box>
              <Box mt={4}>
                  <LicenseModal onSave={handleSubmit}/>
              </Box>
          </Flex>
        </Flex>
        <TableContainer>
          <Table colorScheme="blue" size="sm" fontSize={'xs'}>
            <TableCaption>Licenses Overview</TableCaption>
            <Thead bg="blue.50">
              <Tr>
                <Th onClick={() => handleSort('title')} cursor="pointer">
                  Title {sortField === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th onClick={() => handleSort('expiry_date')} cursor="pointer">
                  Expiry Date {sortField === 'expiry_date' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th onClick={() => handleSort('User.username')} cursor="pointer">
                  Added by {sortField === 'User.username' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th onClick={() => handleSort('Vendor.vendor_name')} cursor="pointer">
                  Vendor {sortField === 'Vendor.vendor_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th onClick={() => handleSort('Category.category_name')} cursor="pointer">
                  Category {sortField === 'Category.category_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th onClick={() => handleSort('Status.status_name')} cursor="pointer">
                  Status {sortField === 'Status.status_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row) => (
                <Tr key={row.license_id}>
                  <Td>{row.title}</Td>
                  <Td>{new Date(row.expiry_date).toLocaleDateString()}</Td>
                  <Td>{row['User.username']}</Td>
                  <Td>{row['Vendor.vendor_name']}</Td>
                  <Td>{row['Category.category_name']}</Td>
                  <Td>{row['Status.status_name']}</Td>
                  <Td>
                    {/* <IconButton
                      mr={2}
                      isRound
                      variant="solid"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                      aria-label="Delete"
                      onClick={() => dispatch(deleteLicense({license_id:row.license_id})).then((res)=>{
                        if(res.payload.message){
                          toast.success("License deleted Successfully");
                        }
                      })}
                    /> */}
                    <AlertDialogS license_id={row.license_id}/>

                    <IconButton
                      isRound
                      variant="solid"
                      colorScheme="blue"
                      icon={<EditIcon />}
                      aria-label="Edit"
                      onClick={() => console.log('Edit', row.license_id)}
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
    </>

  );
}

export default License;
