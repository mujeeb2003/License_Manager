import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, IconButton,Box, Flex, Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, editCategory} from '../redux/license/licenseSlice';
import { AppDispatch, type Category,type RootState,categoryForm } from '../types';
import CategoryModal from './Modals/CategoryModal';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialogS from './Dialog/AlertDialog';
import CategoryEditModal from './Modals/CategoryEditModal';

function Category() {
  const { categories } = useSelector((state: RootState) => state.license);
  const dispatch = useDispatch<AppDispatch>();

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<keyof Category>('category_id');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Handle sorting
  const handleSort = (field: keyof Category) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    setSortField(field);
  };
  // Sort data
  const sortedData = [...categories].sort((a, b) => {
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
  const handleSubmit = (data:categoryForm)=>{
    console.log(data);
    dispatch(createCategory(data)).then((res)=>{
      if(res.payload.category){
        toast.success("Category Added Successfully");
      }
      if(res.payload.error){
        toast.error(res.payload.error);
      }
    }).catch((err)=>{
      toast.error(err);
    });
  }
  const handleEdit = (data:categoryForm & {category_id:number})=>{
    console.log(data);
    dispatch(editCategory(data)).then((res)=>{
      if(res.payload.category){
        toast.success("Category updated Successfully");
      }
      if(res.payload.error){
        toast.error(res.payload.error);
      }
    }).catch((err)=>{
      toast.error(err);
    });
  }
  return (
    <>
      <ToastContainer autoClose={3000} theme="dark" stacked={true}/>
      <Box className="bottom-container license" display={'flex'} flexDirection={'column'} p={4}>
      <Flex justifyContent={'space-between'}  alignItems={'center'} direction={"row"} >
          <span>
          <h1 style={{ color: 'var(--dark)',fontSize:'30px',fontWeight:'bold' }}>Categories</h1> 
          <p style={{color:'var(--dark-grey)'}}>View all of your categories here</p>
          </span>

          <Flex direction="row" gap={4} justifyContent={'flex-end'} alignItems={'center'}>
            <Box mt={4} >
              <CategoryModal onSave={handleSubmit}/>
            </Box>
          </Flex>
        </Flex>
        <TableContainer>
          <Table colorScheme="blue" size="sm" fontSize={'xs'} textAlign={'center'}>
            <TableCaption>Category Overview</TableCaption>
            <Thead bg="blue.50">
              <Tr >
                <Th textAlign={'center'} onClick={() => handleSort('category_id')} cursor="pointer">
                  Title {sortField === 'category_id' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th textAlign={'center'} onClick={() => handleSort('category_name')} cursor="pointer">
                  Category Name {sortField === 'category_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                
                <Th textAlign={'center'}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row) => (
                <Tr key={row.category_id}>
                  <Td textAlign={'center'}>{row.category_id}</Td>
                  <Td textAlign={'center'}>{row.category_name}</Td>
                  <Td textAlign={'right'}>
                    
                    <AlertDialogS category_id={row.category_id}/>
                    <CategoryEditModal category={row} onSave={handleEdit}/>
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

export default Category