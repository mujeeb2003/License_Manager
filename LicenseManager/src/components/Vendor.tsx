import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, IconButton, Box, Flex, Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVendor, editVendor } from '../redux/license/licenseSlice';
import { AppDispatch, type RootState,type Vendor, type vendorForm } from '../types';
import VendorModal from './Modals/VendorModal';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialogS from './Dialog/AlertDialog';
import VendorEditModal from './Modals/VendorEditModal';

function Vendor() {
  const { vendors } = useSelector((state: RootState) => state.license);
  const dispatch = useDispatch<AppDispatch>();

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<keyof Vendor>('vendor_id');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);


  // Handle sorting
  const handleSort = (field: keyof Vendor) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    setSortField(field);
  };
  // Sort data
  const sortedData = [...vendors].sort((a, b) => {
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

  const handleSubmit = (data:vendorForm)=>{
    console.log(data);
    dispatch(createVendor(data)).then((res)=>{
      if(res.payload.vendor){
        toast.success("Vendor Added Successfully");
      }
      if(res.payload.error){
        toast.error(res.payload.error);
      }
    }).catch((err)=>{
      toast.error(err);
    })
  }
  const handleEdit = (data:vendorForm&{vendor_id:number})=>{
    console.log(data);
    dispatch(editVendor(data)).then((res)=>{
      if(res.payload.vendor){
        toast.success("Vendor Updated Successfully");
      }
      if(res.payload.error){
        toast.error(res.payload.error);
      }
    }).catch((err)=>{
      toast.error(err);
    })
  }
  
  return (
    <>
      <ToastContainer autoClose={3000} theme="dark" stacked={true}/>
      <Box className="bottom-container license" display={'flex'} flexDirection={'column'} p={4}>
        <Flex justifyContent={'space-between'}  alignItems={'center'} direction={"column"}>
          <h1 style={{ color: 'var(--dark)',fontSize:'30px',fontWeight:'bold' }}>Vendors</h1> 
          <Box mt={4}>
              <VendorModal onSave={handleSubmit}/>
          </Box>
        </Flex>
        <TableContainer>
          <Table colorScheme="blue" size="sm" fontSize={'xs'} textAlign={'center'}>
            <TableCaption>Vendor Overview</TableCaption>
            <Thead bg="blue.50">
              <Tr >
                <Th textAlign={'center'} onClick={() => handleSort('vendor_id')} cursor="pointer">
                  Title {sortField === 'vendor_id' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('vendor_name')} cursor="pointer">
                  Vendor Name {sortField === 'vendor_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('vendor_email')} cursor="pointer">
                  Vendor Email {sortField === 'vendor_email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('vendor_representative')} cursor="pointer">
                  Vendor Representative {sortField === 'vendor_representative' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('vendor_rep_email')} cursor="pointer">
                  Vendor Representative Email{sortField === 'vendor_rep_email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('vendor_rep_phone')} cursor="pointer">
                  Vendor Representative Phone{sortField === 'vendor_rep_phone' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row) => (
                <Tr key={row.vendor_id}>
                  <Td textAlign={'center'}>{row.vendor_id}</Td>
                  <Td textAlign={'center'}>{row.vendor_name}</Td>
                  <Td textAlign={'center'}>{row.vendor_email}</Td>
                  <Td textAlign={'center'}>{row.vendor_representative}</Td>
                  <Td textAlign={'center'}>{row.vendor_rep_email}</Td>
                  <Td textAlign={'center'}>{row.vendor_rep_phone}</Td>
                  <Td textAlign={'right'}>
                    <AlertDialogS vendor_id={row.vendor_id}/>
                    <VendorEditModal onSave={handleEdit} vendor={row} />
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
  )
}

export default Vendor