import React, { useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
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
    Input,
    Select,
    IconButton,
    // useToast,
    Flex,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Badge,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    AddIcon,
    EditIcon,
    ChevronRightIcon,
    DragHandleIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { createDomain, editDomain } from "../redux/license/licenseSlice";
import { AppDispatch, RootState, Domain, domainForm } from "../types";
import AlertDialogS from "./Dialog/AlertDialog";
import { toast, ToastContainer } from "react-toastify";

const DomainManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { domains } = useSelector((state: RootState) => state.license);
    const { user } = useSelector((state: RootState) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [formData, setFormData] = useState<domainForm>({
        domain_name: "",
        parent_domain_id: 0,
    });

    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "parent_domain_id" ? Number(value) : value,
        });
    };

    const handleSubmit = () => {
        if (formData.parent_domain_id == 0 && !user.isSuperAdmin) {
            toast.error("Please select a parent domain");
            return;
        }
        if (formData.parent_domain_id === editingDomain?.domain_id) {
            toast.error("Cannot set the same domain as parent domain");
            return;
        }

        if (editingDomain) {
            dispatch(
                editDomain({ ...formData, domain_id: editingDomain.domain_id })
            )
                .then((res) => {
                    if (res.payload.domain) {
                        toast.success("Domain Added Successfully");
                    }
                    if (res.payload.error) {
                        toast.error(res.payload.error);
                    }
                    onClose();
                })
                .catch((error) => toast.error(error.message));
        } else {
            dispatch(createDomain(formData))
                .then((res) => {
                    if (res.payload.domain) {
                        toast.success("Domain Added Successfully");
                    }
                    if (res.payload.error) {
                        toast.error(res.payload.error);
                    }
                    onClose();
                })
                .catch((error) => toast.error(error.message));
        }
    };

    const handleEdit = (domain: Domain) => {
        setEditingDomain(domain);
        setFormData({
            domain_name: domain.domain_name,
            parent_domain_id: domain.parent_domain_id || 0,
        });
        onOpen();
    };

    // const handleDelete = (domainId: number) => {
    //     if (window.confirm("Are you sure you want to delete this domain?")) {
    //         dispatch(deleteDomain({ domain_id: domainId }))
    //             .then(() =>
    //                 toast({
    //                     title: "Domain deleted successfully",
    //                     status: "success",
    //                 })
    //             )
    //             .catch((error) =>
    //                 toast({
    //                     title: "Error deleting domain",
    //                     description: error.message,
    //                     status: "error",
    //                 })
    //             );
    //     }
    // };

    const renderDomainItem = (domain: Domain) => (
        <AccordionItem key={domain.domain_id} border="none">
            <AccordionButton
                p={2}
                _hover={{ bg: "gray.100" }}
                borderRadius="md"
            >
                <HStack spacing={2} flex="1" textAlign="left">
                    <ChevronRightIcon />
                    <Text fontWeight="medium">{domain.domain_name}</Text>
                    <Badge colorScheme="blue" ml="auto">
                        {
                            domains.filter(
                                (d) => d.parent_domain_id === domain.domain_id
                            ).length
                        }{" "}
                        subdomains
                    </Badge>
                </HStack>
            </AccordionButton>
            <AccordionPanel pb={4} pl={6}>
                <HStack spacing={2} mb={2}>
                    <IconButton
                        aria-label="Edit domain"
                        icon={<EditIcon />}
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(domain)}
                    />
                    <AlertDialogS domain_id={domain.domain_id} isRound={true} />
                </HStack>
                {renderDomainTree(domain.domain_id)}
            </AccordionPanel>
        </AccordionItem>
    );

    const renderDomainTree = (parentId: number | null = null) => {
        if (!user.isSuperAdmin && user.domain_id) {
            if (!parentId) {
                const userDomain = domains.find(
                    (d) => d.domain_id === user.domain_id
                );
                if (userDomain) {
                    return (
                        <Accordion allowMultiple>
                            {renderDomainItem(userDomain)}
                        </Accordion>
                    );
                }
                return null;
            }
            const childDomains = domains.filter(
                (domain) => domain.parent_domain_id === parentId
            );
            return childDomains.length > 0 ? (
                <Accordion allowMultiple>
                    {childDomains.map((domain) => renderDomainItem(domain))}
                </Accordion>
            ) : null;
        }

        const relevantDomains = domains.filter(
            (domain) => domain.parent_domain_id === parentId
        );
        return relevantDomains.length > 0 ? (
            <Accordion allowMultiple>
                {relevantDomains.map((domain) => renderDomainItem(domain))}
            </Accordion>
        ) : null;
    };

    return (
        <Box p={6} bg={bgColor} minHeight={"80vh"}>
            <ToastContainer theme="colored" stacked={true} autoClose={3000} />
            <VStack align="stretch" spacing={6}>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={5}
                    direction={{ base: "column", md: "row" }}
                >
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                            <DragHandleIcon
                                style={{
                                    display: "inline",
                                    marginRight: "10px",
                                    fontSize: "20px",
                                }}
                            />
                            Domain Management
                        </Text>
                        <Text style={{ color: "var(--dark-grey)" }}>
                            Manage and organize domains in the system
                        </Text>
                    </Box>
                    <Flex mt={{ base: 4, md: 0 }} gap={4} alignItems="center">
                        <Button
                            leftIcon={<AddIcon />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => {
                                setEditingDomain(null);
                                onOpen();
                            }}
                        >
                            Add New Domain
                        </Button>
                    </Flex>
                </Flex>

                <Box
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    maxHeight="600px"
                    overflowY="auto"
                >
                    {renderDomainTree()}
                </Box>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            {editingDomain ? "Edit Domain" : "Add New Domain"}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Domain Name</FormLabel>
                                <Input
                                    name="domain_name"
                                    value={formData.domain_name}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Parent Domain</FormLabel>
                                <Select
                                    name="parent_domain_id"
                                    value={formData.parent_domain_id}
                                    onChange={handleInputChange}
                                    required={user.isSuperAdmin ? false : true}
                                >
                                    <option value={0}>None</option>
                                    {domains.map((domain) => (
                                        <option
                                            key={domain.domain_id}
                                            value={domain.domain_id}
                                        >
                                            {domain.domain_name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleSubmit}
                            >
                                {editingDomain ? "Update" : "Create"}
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    );
};

export default DomainManagement;
