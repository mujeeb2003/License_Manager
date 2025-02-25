import React, { useEffect, useState } from "react";
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
    HStack,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    FaUserLock,
    FaUnlock,
    FaUserShield,
    FaUserAltSlash,
    FaSyncAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllUsers,
    toggleDisable,
    toggleAdmin,
    resetPassword,
    assignDomain,
} from "../redux/user/userSlice";
import { AppDispatch, RootState, User, UserFilters } from "../types";
import { ToastContainer, toast } from "react-toastify";

const UserManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, user } = useSelector((state: RootState) => state.user);
    const { domains } = useSelector((state: RootState) => state.license);

    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [sortField, setSortField] = useState<keyof User>("username");
    const [filters, setFilters] = useState<UserFilters>({
        name: "",
        email: "",
        isAdmin: "",
        isDisable: "",
        "Domain.domain_name": "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const {
        isOpen: isResetModalOpen,
        onOpen: onResetModalOpen,
        onClose: onResetModalClose,
    } = useDisclosure();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState<string>("");

    const bgColor = useColorModeValue("white", "gray.800");
    const headerColor = useColorModeValue("gray.700", "white");
    const subHeaderColor = useColorModeValue("gray.500", "gray.400");
    const tableHeaderBg = useColorModeValue("gray.50", "gray.900");
    const tableRowHoverBg = useColorModeValue("gray.100", "gray.700");

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleSort = (field: keyof User) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(direction);
        setSortField(field);
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleFilterClear = () => {
        setFilters({
            name: "",
            email: "",
            isAdmin: "",
            isDisable: "",
            "Domain.domain_name": "",
        });
        setCurrentPage(1);
    };

    const filteredData = users.filter((user: User) =>
        Object.keys(filters).every((key) => {
            const filterKey = key as keyof UserFilters;
            if (filterKey === "name") {
                return user.username
                    .toLowerCase()
                    .includes(filters.name.toLowerCase());
            }
            if (filterKey === "Domain.domain_name") {
                if (filters["Domain.domain_name"].length === 0) {
                    return true;
                }
                return user["Domain.domain_name"]
                    ?.toLowerCase()
                    .includes(filters["Domain.domain_name"].toLowerCase());
            }
            const userValue =
                (user as any)[filterKey]?.toString().toLowerCase() || "";
            return filters[filterKey]
                ? userValue.includes(filters[filterKey].toLowerCase())
                : true;
        })
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue && bValue) {
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        }
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

    const handleResetPassword = (user_id: number) => {
        setSelectedUserId(user_id);
        onResetModalOpen();
    };

    const handleConfirmResetPassword = async () => {
        if (selectedUserId && newPassword) {
            try {
                await dispatch(
                    resetPassword({
                        user_id: selectedUserId,
                        password: newPassword,
                    })
                ).then((res) => {
                    if (res.payload.user) {
                        toast.success("User password reset successfully");
                    }
                    if (res.payload.error) {
                        toast.error(res.payload.error);
                    }
                });
            } catch (err: any) {
                toast.error(err.error || "Failed to reset password");
            }
            onResetModalClose();
            setNewPassword("");
        }
    };

    const handleToggleDisable = async (user_id: number) => {
        try {
            if (user_id === user.user_id)
                return toast.warning("Super admin cannot be disabled");
            await dispatch(toggleDisable({ user_id })).then((res) => {
                if (res.payload.user) {
                    toast.success("User status updated successfully");
                }
                if (res.payload.error) {
                    toast.error(res.payload.error);
                }
            });
        } catch (err: any) {
            toast.error(err.error || "Failed to update user status");
        }
    };

    const handleToggleAdmin = async (user_id: number) => {
        try {
            if (user_id === user.user_id)
                return toast.warning("The Super Admin cannot be demoted");
            if (
                users.filter((user) => user.isAdmin === true).length === 1 &&
                users.find((user) => user.user_id === user_id)?.isAdmin === true
            ) {
                return toast.warning("The last admin cannot be demoted");
            }
            await dispatch(toggleAdmin({ user_id })).then((res) => {
                if (res.payload.user) {
                    toast.success("User role updated successfully");
                }
                if (res.payload.error) {
                    toast.error(res.payload.error);
                }
            });
        } catch (err: any) {
            toast.error(err.error || "Failed to update user role");
        }
    };

    const handleAssignDomain = async (user_id: number, domain_id: number) => {
        try {
            await dispatch(assignDomain({ user_id, domain_id })).then((res) => {
                console.log(res);
                if (res.payload.user) {
                    toast.success("User Assigned Domain successfully");
                }
                if (res.payload.error) {
                    toast.error(res.payload.error);
                }
            });
        } catch (err: any) {
            toast.error(err.error || "Failed to update user domain");
        }
    };

    return (
        <Box p={6} bg={bgColor} borderRadius="lg">
            <ToastContainer autoClose={3000} theme="colored" />
            <VStack spacing={6} align="stretch">
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                >
                    <Box>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={headerColor}
                        >
                            User Management
                        </Text>
                        <Text color={subHeaderColor}>
                            Manage all users in the system
                        </Text>
                    </Box>
                    <Button
                        colorScheme="red"
                        size="sm"
                        onClick={handleFilterClear}
                        mt={{ base: 4, md: 0 }}
                    >
                        Clear Filters
                    </Button>
                </Flex>

                <Accordion allowToggle>
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
                                direction={{ base: "column", md: "row" }}
                                gap={4}
                                alignItems="center"
                            >
                                <Input
                                    placeholder="Filter by Name"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                    size="sm"
                                    rounded="lg"
                                />
                                <Input
                                    placeholder="Filter by Email"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleFilterChange}
                                    size="sm"
                                    rounded="lg"
                                />
                                <Select
                                    placeholder="Filter by Role"
                                    name="isAdmin"
                                    value={filters.isAdmin}
                                    onChange={handleFilterChange}
                                    size="sm"
                                    rounded="lg"
                                >
                                    <option value="1">Admin</option>
                                    <option value="0">User</option>
                                </Select>
                                <Select
                                    placeholder="Filter by Status"
                                    name="isDisable"
                                    value={filters.isDisable}
                                    onChange={handleFilterChange}
                                    size="sm"
                                    rounded="lg"
                                >
                                    <option value="0">Active</option>
                                    <option value="1">Disabled</option>
                                </Select>
                                <Select
                                    placeholder="Filter by Domain"
                                    name="Domain.domain_name"
                                    value={filters["Domain.domain_name"]}
                                    onChange={handleFilterChange}
                                    size="sm"
                                    rounded="lg"
                                >
                                    <option value="">No Domain</option>
                                    {domains.map((domain) => (
                                        <option
                                            key={domain.domain_id}
                                            value={domain.domain_name}
                                        >
                                            {domain.domain_name}
                                        </option>
                                    ))}
                                </Select>
                            </Flex>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <TableContainer>
                    <Table variant="simple" colorScheme="gray" size="sm">
                        <TableCaption>Users Overview</TableCaption>
                        <Thead bg={tableHeaderBg}>
                            <Tr>
                                {[
                                    "username",
                                    "email",
                                    "isDisable",
                                    "isAdmin",
                                    "Domain.domain_name",
                                ].map((field) => (
                                    <Th
                                        key={field}
                                        cursor="pointer"
                                        onClick={() =>
                                            handleSort(field as keyof User)
                                        }
                                        _hover={{ bg: tableRowHoverBg }}
                                    >
                                        {field === "Domain.domain_name"
                                            ? "Domain"
                                            : field.charAt(0).toUpperCase() +
                                              field.slice(1)}
                                        {sortField === field &&
                                            (sortDirection === "asc"
                                                ? " ▲"
                                                : " ▼")}
                                    </Th>
                                ))}
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
                                            color={
                                                user.isDisable
                                                    ? "red.500"
                                                    : "green.500"
                                            }
                                            fontWeight="bold"
                                        >
                                            {user.isDisable
                                                ? "Disabled"
                                                : "Active"}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text
                                            color={
                                                user.isAdmin
                                                    ? "blue.500"
                                                    : "gray.500"
                                            }
                                        >
                                            {user.isAdmin ? "Admin" : "User"}
                                        </Text>
                                    </Td>
                                    <Td>{user["Domain.domain_name"]}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Tooltip
                                                label={
                                                    user.isDisable
                                                        ? "Enable User"
                                                        : "Disable User"
                                                }
                                            >
                                                <IconButton
                                                    icon={
                                                        user.isDisable ? (
                                                            <FaUnlock />
                                                        ) : (
                                                            <FaUserLock />
                                                        )
                                                    }
                                                    aria-label={
                                                        user.isDisable
                                                            ? "Enable User"
                                                            : "Disable User"
                                                    }
                                                    colorScheme={
                                                        user.isDisable
                                                            ? "green"
                                                            : "red"
                                                    }
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleDisable(
                                                            user.user_id
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                label={
                                                    user.isAdmin
                                                        ? "Demote to User"
                                                        : "Promote to Admin"
                                                }
                                            >
                                                <IconButton
                                                    icon={
                                                        user.isAdmin ? (
                                                            <FaUserAltSlash />
                                                        ) : (
                                                            <FaUserShield />
                                                        )
                                                    }
                                                    aria-label={
                                                        user.isAdmin
                                                            ? "Demote to User"
                                                            : "Promote to Admin"
                                                    }
                                                    colorScheme={
                                                        user.isAdmin
                                                            ? "yellow"
                                                            : "blue"
                                                    }
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleAdmin(
                                                            user.user_id
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                            <Tooltip label="Reset Password">
                                                <IconButton
                                                    icon={<FaSyncAlt />}
                                                    aria-label="Reset Password"
                                                    colorScheme="teal"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleResetPassword(
                                                            user.user_id
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                            <Tooltip label="Assign Domain">
                                                <Select
                                                    size="sm"
                                                    value={user.domain_id || ""}
                                                    onChange={(e) =>
                                                        handleAssignDomain(
                                                            user.user_id,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    rounded={"lg"}
                                                >
                                                    <option value="">
                                                        No Domain
                                                    </option>
                                                    {domains.map((domain) => (
                                                        <option
                                                            key={
                                                                domain.domain_id
                                                            }
                                                            value={
                                                                domain.domain_id
                                                            }
                                                        >
                                                            {domain.domain_name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </Tooltip>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Td colSpan={6}>
                                    <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            isDisabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Text>
                                            Page {currentPage} of {totalPages}
                                        </Text>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            isDisabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>

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
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    type="password"
                                    minLength={8}
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
            </VStack>
        </Box>
    );
};

export default UserManagement;
