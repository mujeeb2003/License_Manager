import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    useColorModeValue,
    Heading,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    Tag,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createManager, editManager } from "../redux/license/licenseSlice";
import { AppDispatch, RootState, Manager, managerForm } from "../types";
import { toast, ToastContainer } from "react-toastify";
import { FaUserTie, FaSearch, FaSort } from "react-icons/fa";
import AddManagerModal from "./Modals/ManagerModal";
import EditManagerModal from "./Modals/ManagerEditModal";

const Managers: React.FC = () => {
    const { managers } = useSelector((state: RootState) => state.license);
    const dispatch = useDispatch<AppDispatch>();

    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [sortField, setSortField] = useState<keyof Manager>("manager_id");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const hoverBgColor = useColorModeValue("gray.100", "gray.700");

    const handleSort = (field: keyof Manager) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(direction);
        setSortField(field);
    };

    const sortedData =
        managers &&
        [...managers]
            ?.filter((manager) =>
                Object.values(manager).some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            )
            ?.sort((a, b) => {
                if (a[sortField] < b[sortField])
                    return sortDirection === "asc" ? -1 : 1;
                if (a[sortField] > b[sortField])
                    return sortDirection === "asc" ? 1 : -1;
                return 0;
            });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSubmit = (data: managerForm) => {
        dispatch(createManager(data))
            .then((res) => {
                if (res.payload.manager) {
                    toast.success("Manager Added Successfully");
                }
                if (res.payload.error) {
                    toast.error(res.payload.error);
                }
            })
            .catch((err) => {
                toast.error(err);
            });
    };

    const handleEdit = (data: managerForm & { manager_id: number }) => {
        dispatch(editManager(data))
            .then((res) => {
                if (res.payload.manager) {
                    toast.success("Manager Updated Successfully");
                }
                if (res.payload.error) {
                    toast.error(res.payload.error);
                }
            })
            .catch((err) => {
                toast.error(err);
            });
    };

    return (
        <Box p={4} bg={bgColor} borderRadius="lg">
            <ToastContainer autoClose={3000} theme="dark" stacked={true} />
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Heading size="lg" color={textColor}>
                            <FaUserTie
                                style={{
                                    display: "inline",
                                    marginRight: "10px",
                                    fontSize: "25px"
                                }}
                            />
                            Managers
                        </Heading>
                    </Box>
                    <Text color='var(--dark-grey)'>
                        Manage your product managers efficiently
                    </Text>
                </Box>
                <AddManagerModal onSave={handleSubmit} />
            </Flex>

            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <InputGroup maxW="300px">
                    <InputLeftElement pointerEvents="none">
                        <FaSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search managers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </Flex>

            <TableContainer>
                <Table variant="simple" colorScheme="blue" size={"sm"}>
                    <TableCaption>Managers Overview</TableCaption>
                    <Thead>
                        <Tr>
                            {["id", "name", "email", "domains"].map((field) => (
                                <Th
                                    key={field}
                                    onClick={() => field !== "domains" && handleSort(field as keyof Manager)}
                                    cursor={field !== "domains" ? "pointer" : "default"}
                                >
                                    <Flex alignItems="center">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                        {field !== "domains" && <FaSort style={{ marginLeft: "5px" }} />}
                                    </Flex>
                                </Th>
                            ))}
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentData?.map((manager,index) => (
                            <Tr
                                key={manager.manager_id}
                                _hover={{ bg: hoverBgColor }}
                            >
                                <Td>{index+1}</Td>
                                <Td>{manager.name}</Td>
                                <Td>{manager.email}</Td>
                                <Td>
                                    {manager.Domains.map((domain) => (
                                        <Tag key={domain.domain_id} mr={2} mb={2}>
                                            {domain.domain_name}
                                        </Tag>
                                    ))}
                                </Td>
                                <Td>
                                    <EditManagerModal
                                        manager={manager}
                                        onSave={handleEdit}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Flex justifyContent="space-between" alignItems="center" mt={4}>
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
        </Box>
    );
};

export default Managers;