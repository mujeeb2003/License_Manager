// UserManagement.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  Input,
  Select,
  Box,
  Flex,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
} from '@chakra-ui/react';
import {
  FaUserLock,
  FaUnlock,
  FaUserShield,
  FaUserAltSlash,
  FaSyncAlt,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllUsers,
  toggleDisable,
  toggleAdmin,
  resetPassword,
} from '../redux/user/userSlice';
import { AppDispatch, RootState, User, UserFilters } from '../types';
import { ToastContainer, toast } from 'react-toastify';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users,user } = useSelector(
    (state: RootState) => state.user
  );

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<keyof User>('username');
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    email: '',
    isAdmin: '',
    isDisable: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal for resetting password
  const {
    isOpen: isResetModalOpen,
    onOpen: onResetModalOpen,
    onClose: onResetModalClose,
  } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handle sorting
  const handleSort = (field: keyof User) => {
    const direction =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    setSortField(field);
  };

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to page 1 after filtering
  };

  // Clear all filters
  const handleFilterClear = () => {
    setFilters({
      name: '',
      email: '',
      isAdmin: '',
      isDisable: '',
    });
    setCurrentPage(1);
  };

  // Filter data
  const filteredData = users.filter((user: User) =>
    Object.keys(filters).every((key) => {
      const filterKey = key as keyof UserFilters;
      const userValue = (user as any)[filterKey]
        ?.toString()
        .toLowerCase() || '';
      return filters[filterKey]
        ? userValue.includes(filters[filterKey].toLowerCase())
        : true;
    })
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
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

  const handleResetPassword = (user_id: number) => {
    setSelectedUserId(user_id);
    onResetModalOpen();
  };

  const handleConfirmResetPassword = async () => {
    if (selectedUserId && newPassword) {
      try {
        await dispatch(resetPassword({ user_id: selectedUserId, password: newPassword })).unwrap();
        toast.success('Password reset successfully');
      } catch (err: any) {
        toast.error(err.error || 'Failed to reset password');
      }
      onResetModalClose();
      setNewPassword('');
    }
  };

  // Handle toggle disable/enable
  const handleToggleDisable = async (user_id: number) => {
    try {
      if(user_id === user.user_id) return toast.warning("Super admin cannot be disabled");
      
      await dispatch(toggleDisable({ user_id })).unwrap();
      toast.success('User status updated successfully');
    } catch (err: any) {
      toast.error(err.error || 'Failed to update user status');
    }
  };

  // Handle toggle admin/user
  const handleToggleAdmin = async (user_id: number) => {
    try {
      if(user_id === user.user_id) return toast.warning("The Super Admin cannot be demoted")

      if(users.filter((user)=>user.isAdmin === true).length == 1 && users.filter((user)=>user.user_id == user_id)[0].isAdmin === true){
        return toast.warning("The last admin cannot be demoted");
      }
      await dispatch(toggleAdmin({ user_id })).unwrap();
      toast.success('User role updated successfully');
    } catch (err: any) {
      toast.error(err.error || 'Failed to update user role');
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} theme="colored" />
      <Box p={5}>
        {/* Header */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={5}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              User Management
            </Text>
            <Text color="gray.500">Manage all users in the system</Text>
          </Box>
          <Flex mt={{ base: 4, md: 0 }} gap={4} alignItems="center">
            <Button colorScheme="red" size={'sm'} onClick={handleFilterClear}>
              Clear Filters
            </Button>
            
          </Flex>
        </Flex>

        {/* Filters Accordion */}
        <Accordion allowToggle mb={5}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Filter Users
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                alignItems="center"
              >
                <Box flex={1}>
                  <Input
                    placeholder="Filter by Name"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                  />
                </Box>
                <Box flex={1}>
                  <Input
                    placeholder="Filter by Email"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                  />
                </Box>
                <Box flex={1}>
                  <Select
                    placeholder="Filter by Role"
                    name="isAdmin"
                    value={filters.isAdmin}
                    onChange={handleFilterChange}
                  >
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </Select>
                </Box>

                <Box flex={1}>
                  <Select
                    placeholder="Filter by Status"
                    name="isDisable"
                    value={filters.isDisable}
                    onChange={handleFilterChange}
                  >
                    <option value="false">Active</option>
                    <option value="true">Disabled</option>
                  </Select>
                </Box>

              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* User Table */}
        <TableContainer>
          <Table variant="striped" colorScheme="gray">
            <TableCaption>Users Overview</TableCaption>
            <Thead bg="gray.100">
              <Tr>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort('username')}
                  _hover={{ bg: 'gray.200' }}
                >
                  Username {sortField === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort('email')}
                  _hover={{ bg: 'gray.200' }}
                >
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort('isDisable')}
                  _hover={{ bg: 'gray.200' }}
                >
                  Status {sortField === 'isDisable' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort('isAdmin')}
                  _hover={{ bg: 'gray.200' }}
                >
                  Role {sortField === 'isAdmin' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((user) => (
                <Tr key={user.user_id}>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Text
                      color={user.isDisable ? 'red.500' : 'green.500'}
                      fontWeight="bold"
                    >
                      {user.isDisable ? 'Disabled' : 'Active'}
                    </Text>
                  </Td>
                  <Td>
                    <Text color={user.isAdmin ? 'blue.500' : 'gray.500'}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </Text>
                  </Td>
                  <Td>
                    {/* Enable/Disable Button */}
                    <Tooltip
                      label={user.isDisable ? 'Enable User' : 'Disable User'}
                      fontSize="sm"
                    >
                      <IconButton
                        icon={user.isDisable ? <FaUnlock /> : <FaUserLock />}
                        aria-label={
                          user.isDisable ? 'Enable User' : 'Disable User'
                        }
                        colorScheme={user.isDisable ? 'green' : 'red'}
                        variant="outline"
                        size="sm"
                        mr={2}
                        onClick={() => handleToggleDisable(user.user_id)}
                      />
                    </Tooltip>

                    {/* Toggle Admin Button */}
                    <Tooltip
                      label={
                        user.isAdmin ? 'Demote to User' : 'Promote to Admin'
                      }
                      fontSize="sm"
                    >
                      <IconButton
                        icon={user.isAdmin ? <FaUserAltSlash /> : <FaUserShield />}
                        aria-label={
                          user.isAdmin ? 'Demote to User' : 'Promote to Admin'
                        }
                        colorScheme={user.isAdmin ? 'yellow' : 'blue'}
                        variant="outline"
                        size="sm"
                        mr={2}
                        onClick={() => handleToggleAdmin(user.user_id)}
                      />
                    </Tooltip>

                    {/* Reset Password Button */}
                    <Tooltip label="Reset Password" fontSize="sm">
                      <IconButton
                        icon={<FaSyncAlt />}
                        aria-label="Reset Password"
                        colorScheme="teal"
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.user_id)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td colSpan={5}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Button
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {currentPage} of {totalPages}
                    </Text>
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

        {/* Reset Password Modal */}
        <Modal isOpen={isResetModalOpen} onClose={onResetModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reset Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleConfirmResetPassword}
                isDisabled={!newPassword}
              >
                Confirm
              </Button>
              <Button variant="ghost" onClick={onResetModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default UserManagement;
