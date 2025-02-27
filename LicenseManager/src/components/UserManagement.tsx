import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    IconButton,
    Badge,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    TableContainer,
    Input,
    Select,
    Stack,
    HStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    useToast,
    Text,
} from "@chakra-ui/react";
import {
    FiUserPlus,
    FiUserMinus,
    FiUserX,
    FiUserCheck,
    FiKey,
    FiGlobe,
    FiUsers,
} from "react-icons/fi";
import { AppDispatch, RootState } from "../types";
import {
    getAllUsers,
    toggleAdmin,
    toggleDisable,
    resetPassword,
    assignDomain,
    addUser,
} from "../redux/user/userSlice";
import {
    createManager,
    removeManager,
    getLicenseOpt,
} from "../redux/license/licenseSlice";
import { User, UserFilters } from "../types";

const UserManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, user } = useSelector((state: RootState) => state.user);
    const { domains, managers } = useSelector(
        (state: RootState) => state.license
    );
    const toast = useToast();

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

    // Reset password modal
    const {
        isOpen: isResetModalOpen,
        onOpen: onResetModalOpen,
        onClose: onResetModalClose,
    } = useDisclosure();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState("");

    // Add user modal
    const {
        isOpen: isAddUserModalOpen,
        onOpen: onAddUserModalOpen,
        onClose: onAddUserModalClose,
    } = useDisclosure();
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
        domain_id: null as number | null,
    });

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getLicenseOpt()); // This will fetch managers too
    }, [dispatch]);

    // Check if user can edit another user
    const canEditUser = (targetUser: User) => {
        if (!user) return false;

        // Superadmin can edit anyone except themselves for admin toggle
        if (user.isSuperAdmin) return true;

        // Regular admins can only edit non-admin users in their domain or subdomains
        if (user.isAdmin) {
            return targetUser && true;
        }

        return false;
    };

    // Helper to check if a domain is a descendant of another
    const isDescendantDomain = (
        childDomainId: number | null,
        parentDomainId: number | null
    ) => {
        // Implement domain hierarchy check here
        // For now, simple equality check
        return childDomainId === parentDomainId;
    };

    // Check if the target user is the current user
    const isSelf = (targetUser: User) => {
        return user && targetUser.user_id === user.user_id;
    };

    // Handle actions
    const handleToggleAdmin = async (userId: number) => {
        try {
            await dispatch(toggleAdmin({ user_id: userId })).unwrap();
            toast({
                title: "Success",
                description: "User admin status updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error:any) {
            toast({
                title: "Error",
                description: error && error.error || "Failed to update user admin status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleToggleDisable = async (userId: number) => {
        try {
            await dispatch(toggleDisable({ user_id: userId })).unwrap();
            toast({
                title: "Success",
                description: "User status updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleResetPassword = (userId: number) => {
        setSelectedUserId(userId);
        onResetModalOpen();
    };

    const submitResetPassword = async () => {
        if (!selectedUserId || !newPassword) return;

        try {
            await dispatch(
                resetPassword({
                    user_id: selectedUserId,
                    password: newPassword,
                })
            ).unwrap();
            toast({
                title: "Success",
                description: "Password reset successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setNewPassword("");
            onResetModalClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reset password",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAssignDomain = async (
        userId: number,
        domainId: number | null
    ) => {
        try {
            await dispatch(
                assignDomain({ user_id: userId, domain_id: domainId })
            ).unwrap();
            toast({
                title: "Success",
                description: "Domain assigned successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAddUser = async () => {
        try {
            await dispatch(
                addUser({
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                    isAdmin: newUser.isAdmin,
                    domain_id: newUser.domain_id,
                })
            ).unwrap();

            toast({
                title: "Success",
                description: "User added successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Reset form and close modal
            setNewUser({
                username: "",
                email: "",
                password: "",
                isAdmin: false,
                domain_id: null,
            });
            onAddUserModalClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add user",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const isUserManager = (userId: number): boolean => {
        return managers.some((manager) => manager.user_id === userId);
    };

    // Add this function to handle manager toggle
    const handleToggleManager = async (userId: number) => {
        try {
            // If user is already a manager, remove them
            if (isUserManager(userId)) {
                const manager = managers.find((m) => m.user_id === userId);
                if (manager) {
                    await dispatch(
                        removeManager({ manager_id: manager.manager_id })
                    ).unwrap();
                    toast({
                        title: "Success",
                        description: "Manager role removed",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
            // Otherwise, add them as a manager
            else {
                const userToMakeManager = users.find(
                    (u) => u.user_id === userId
                );
                if (userToMakeManager) {
                    await dispatch(
                        createManager({
                            user_id: userId,
                            domain_id: userToMakeManager.domain_id,
                        })
                    ).unwrap();
                    toast({
                        title: "Success",
                        description: "Manager role assigned",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
            // Refresh the data
            // dispatch(getLicenseOpt());
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.error || "Failed to update manager status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Filter and sort users
    const filteredUsers = users.filter((user) => {
        return (
            (filters.name
                ? user.username
                      .toLowerCase()
                      .includes(filters.name.toLowerCase())
                : true) &&
            (filters.email
                ? user.email.toLowerCase().includes(filters.email.toLowerCase())
                : true) &&
            (filters.isAdmin
                ? String(user.isAdmin) === filters.isAdmin
                : true) &&
            (filters.isDisable
                ? String(user.isDisable) === filters.isDisable
                : true) &&
            (filters["Domain.domain_name"]
                ? user["Domain.domain_name"]
                      ?.toLowerCase()
                      .includes(filters["Domain.domain_name"].toLowerCase())
                : true)
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const fieldA = a[sortField] || "";
        const fieldB = b[sortField] || "";

        if (typeof fieldA === "string" && typeof fieldB === "string") {
            return sortDirection === "asc"
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        }

        return sortDirection === "asc"
            ? fieldA > fieldB
                ? 1
                : -1
            : fieldB > fieldA
            ? 1
            : -1;
    });

    // Pagination
    // const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handleSort = (field: keyof User) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const bgColor = useColorModeValue("white", "gray.800");

    return (
        <Box p={6} bg={bgColor} borderRadius="lg" minHeight={"80vh"}>
            <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                direction={"row"}
                marginBottom={4}
            >
                <span>
                    <h1
                        style={{
                            color: "var(--dark)",
                            fontSize: "30px",
                            fontWeight: "bold",
                        }}
                    >
                        <IconButton
                            icon={<FiUsers />}
                            aria-label=""
                            variant="outline"
                            size="sm"
                            mr={2}
                        />
                        User Management
                    </h1>
                    <p style={{ color: "var(--dark-grey)" }}>
                        Manage all your users here
                    </p>
                </span>

                <Flex
                    direction="row"
                    gap={4}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                >
                    <Box>
                        <Button
                            leftIcon={<FiUserPlus />}
                            colorScheme="blue"
                            onClick={onAddUserModalOpen}
                            size={"md"}
                            rounded={"md"}
                        >
                            Add New User
                        </Button>
                    </Box>
                </Flex>
            </Flex>
            <Stack spacing={4}>
                <HStack justify="space-between" marginLeft={"auto"}>
                    <HStack>
                        <Input
                            placeholder="Filter by name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            size="sm"
                            width="150px"
                            rounded={"md"}
                        />
                        <Input
                            placeholder="Filter by email"
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            size="sm"
                            width="150px"
                            rounded={"md"}
                        />
                        <Select
                            placeholder="Admin Status"
                            name="isAdmin"
                            value={filters.isAdmin}
                            onChange={handleFilterChange}
                            size="sm"
                            width="150px"
                            rounded={"md"}
                        >
                            <option value="1">Admin</option>
                            <option value="0">User</option>
                        </Select>
                        <Select
                            placeholder="User Status"
                            name="isDisable"
                            value={filters.isDisable}
                            onChange={handleFilterChange}
                            size="sm"
                            width="150px"
                            rounded={"md"}
                        >
                            <option value="1">Disabled</option>
                            <option value="0">Active</option>
                        </Select>
                        <Input
                            placeholder="Filter by domain"
                            name="Domain.domain_name"
                            value={filters["Domain.domain_name"]}
                            onChange={handleFilterChange}
                            size="sm"
                            width="150px"
                            rounded={"md"}
                        />
                    </HStack>
                </HStack>

                <TableContainer>
                    <Table variant="simple" colorScheme="gray" size="sm">
                        <Thead>
                            <Tr>
                                <Th
                                    onClick={() => handleSort("username")}
                                    cursor="pointer"
                                >
                                    Username{" "}
                                    {sortField === "username" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </Th>
                                <Th
                                    onClick={() => handleSort("email")}
                                    cursor="pointer"
                                >
                                    Email{" "}
                                    {sortField === "email" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </Th>
                                <Th
                                    onClick={() => handleSort("isDisable")}
                                    cursor="pointer"
                                >
                                    Status{" "}
                                    {sortField === "isDisable" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </Th>
                                <Th
                                    onClick={() => handleSort("isAdmin")}
                                    cursor="pointer"
                                >
                                    Role{" "}
                                    {sortField === "isAdmin" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </Th>
                                <Th
                                    onClick={() =>
                                        handleSort("Domain.domain_name")
                                    }
                                    cursor="pointer"
                                >
                                    Domain{" "}
                                    {sortField === "Domain.domain_name" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentData.map((userData) => (
                                <Tr key={userData.user_id}>
                                    <Td>{userData.username}</Td>
                                    <Td>{userData.email}</Td>
                                    <Td>
                                        <Badge
                                            colorScheme={
                                                userData.isDisable
                                                    ? "red"
                                                    : "green"
                                            }
                                            rounded={"md"}
                                        >
                                            {userData.isDisable
                                                ? "Disabled"
                                                : "Active"}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <Badge
                                            colorScheme={
                                                userData.isAdmin
                                                    ? "purple"
                                                    : "blue"
                                            }
                                            rounded={"md"}
                                        >
                                            {userData.isAdmin
                                                ? "Admin"
                                                : "User"}
                                        </Badge>

                                        {userData.isSuperAdmin ? (
                                            <Badge
                                                ml={2}
                                                colorScheme="red"
                                                rounded={"md"}
                                            >
                                                Super Admin
                                            </Badge>
                                        ) : null}

                                        {isUserManager(userData.user_id) && (
                                            <Badge
                                                ml={2}
                                                colorScheme="orange"
                                                rounded={"md"}
                                            >
                                                Manager
                                            </Badge>
                                        )}
                                    </Td>
                                    <Td>
                                        {userData["Domain.domain_name"] ||
                                            "No Domain"}
                                    </Td>
                                    <Td>
                                        {/* Actions for users the current user can edit */}
                                        {!isSelf(userData) &&
                                            canEditUser(userData) && (
                                                <Flex gap={2}>
                                                    <IconButton
                                                        aria-label="Toggle disable"
                                                        icon={
                                                            userData.isDisable ? (
                                                                <FiUserCheck />
                                                            ) : (
                                                                <FiUserX />
                                                            )
                                                        }
                                                        size="sm"
                                                        colorScheme={
                                                            userData.isDisable
                                                                ? "green"
                                                                : "red"
                                                        }
                                                        onClick={() =>
                                                            handleToggleDisable(
                                                                userData.user_id
                                                            )
                                                        }
                                                        title={
                                                            userData.isDisable
                                                                ? "Enable user"
                                                                : "Disable user"
                                                        }
                                                    />
                                                    {user?.isAdmin && (
                                                        <IconButton
                                                            aria-label="Toggle admin"
                                                            icon={
                                                                userData.isAdmin ? (
                                                                    <FiUserMinus />
                                                                ) : (
                                                                    <FiUserPlus />
                                                                )
                                                            }
                                                            size="sm"
                                                            colorScheme={
                                                                userData.isAdmin
                                                                    ? "red"
                                                                    : "purple"
                                                            }
                                                            onClick={() =>
                                                                handleToggleAdmin(
                                                                    userData.user_id
                                                                )
                                                            }
                                                            title={
                                                                userData.isAdmin
                                                                    ? "Remove admin privileges"
                                                                    : "Grant admin privileges"
                                                            }
                                                        />
                                                    )}
                                                    <IconButton
                                                        aria-label="Toggle manager role"
                                                        icon={
                                                            isUserManager(
                                                                userData.user_id
                                                            ) ? (
                                                                <FiUsers />
                                                            ) : (
                                                                <FiUserPlus />
                                                            )
                                                        }
                                                        size="sm"
                                                        colorScheme={
                                                            isUserManager(
                                                                userData.user_id
                                                            )
                                                                ? "blue"
                                                                : "orange"
                                                        }
                                                        onClick={() =>
                                                            handleToggleManager(
                                                                userData.user_id
                                                            )
                                                        }
                                                        title={
                                                            isUserManager(
                                                                userData.user_id
                                                            )
                                                                ? "Remove manager role"
                                                                : "Assign manager role"
                                                        }
                                                    />
                                                    <IconButton
                                                        aria-label="Reset password"
                                                        icon={<FiKey />}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        onClick={() =>
                                                            handleResetPassword(
                                                                userData.user_id
                                                            )
                                                        }
                                                        title="Reset user password"
                                                    />
                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            aria-label="Assign domain"
                                                            icon={<FiGlobe />}
                                                            size="sm"
                                                            colorScheme="teal"
                                                            title="Assign user to a domain"
                                                        />
                                                        <MenuList>
                                                            {domains
                                                                .filter(
                                                                    (
                                                                        domain
                                                                    ) => {
                                                                        // Superadmin can assign any domain
                                                                        if (
                                                                            user?.isSuperAdmin
                                                                        )
                                                                            return true;

                                                                        // Admin can only assign their own domain or subdomains
                                                                        return (
                                                                            domain.domain_id ===
                                                                                user?.domain_id ||
                                                                            isDescendantDomain(
                                                                                domain.domain_id,
                                                                                user?.domain_id
                                                                            )
                                                                        );
                                                                    }
                                                                )
                                                                .map(
                                                                    (
                                                                        domain
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                domain.domain_id
                                                                            }
                                                                            onClick={() =>
                                                                                handleAssignDomain(
                                                                                    userData.user_id,
                                                                                    domain.domain_id
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                domain.domain_name
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            <MenuItem
                                                                onClick={() =>
                                                                    handleAssignDomain(
                                                                        userData.user_id,
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                No Domain
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>
                                            )}

                                        {/* Show a badge for current user */}
                                        {isSelf(userData) && (
                                            <Badge colorScheme="gray">
                                                Current User
                                            </Badge>
                                        )}

                                        {/* No actions available for users that can't be edited */}
                                        {!isSelf(userData) &&
                                            !canEditUser(userData) && (
                                                <Badge colorScheme="gray">
                                                    No Actions Available
                                                </Badge>
                                            )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        /> */}
            </Stack>

            {/* Reset Password Modal */}
            <Modal isOpen={isResetModalOpen} onClose={onResetModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reset User Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>New Password</FormLabel>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={submitResetPassword}
                        >
                            Reset Password
                        </Button>
                        <Button variant="ghost" onClick={onResetModalClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={onAddUserModalClose}
                size="md"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    placeholder="Enter username"
                                    value={newUser.username}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Domain</FormLabel>
                                <Select
                                    placeholder="Select domain"
                                    value={newUser.domain_id?.toString() || ""}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            domain_id: e.target.value
                                                ? parseInt(e.target.value)
                                                : null,
                                        })
                                    }
                                >
                                    <option value="">No Domain</option>
                                    {domains
                                        .filter((domain) => {
                                            if (user?.isSuperAdmin) return true;

                                            // Admin can only assign their own domain or subdomains
                                            return (
                                                domain.domain_id ===
                                                    user?.domain_id ||
                                                isDescendantDomain(
                                                    domain.domain_id,
                                                    user?.domain_id
                                                )
                                            );
                                        })
                                        .map((domain) => (
                                            <option
                                                key={domain.domain_id}
                                                value={domain.domain_id}
                                            >
                                                {domain.domain_name}
                                            </option>
                                        ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    value={newUser.isAdmin ? "admin" : "user"}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            isAdmin: e.target.value === "admin",
                                        })
                                    }
                                >
                                    <option value="user">Regular User</option>
                                    {/* Only show admin option if superadmin or if admin isn't creating in their own domain */}
                                    {(user?.isSuperAdmin ||
                                        user?.domain_id !==
                                            newUser.domain_id) && (
                                        <option value="admin">Admin</option>
                                    )}
                                </Select>
                                {!user?.isSuperAdmin &&
                                    user?.domain_id === newUser.domain_id && (
                                        <Text
                                            fontSize="sm"
                                            color="red.500"
                                            mt={1}
                                        >
                                            You cannot create an admin in your
                                            own domain
                                        </Text>
                                    )}
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleAddUser}
                            isDisabled={
                                !newUser.username ||
                                !newUser.email ||
                                !newUser.password ||
                                (!user?.isSuperAdmin &&
                                    user?.domain_id === newUser.domain_id &&
                                    newUser.isAdmin)
                            }
                        >
                            Add User
                        </Button>
                        <Button variant="ghost" onClick={onAddUserModalClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default UserManagement;
