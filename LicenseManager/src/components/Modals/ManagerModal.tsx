import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    FormErrorMessage,
} from "@chakra-ui/react";
import { managerForm } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../types";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import CustomMultiSelect from "../subComponents/CustomMultiSelect";

interface AddManagerModalProps {
    onSave: (data: managerForm) => void;
}

const AddManagerModal: React.FC<AddManagerModalProps> = ({ onSave }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state: RootState) => state.user);
    const { domains } = useSelector((state: RootState) => state.license);

    const [formData, setFormData] = useState<managerForm>({
        name: "",
        email: "",
        domain_ids: [],
    });

    let [errors, setErrors] = useState<{
        name: string;
        email: string;
        domain_ids: string;
    }>({
        name: "",
        email: "",
        domain_ids: "",
    });

    const handleClick = () => {
        !isAdmin ? toast.warning("Only Admins can add Managers") : onOpen();
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "domain_ids" && e.target instanceof HTMLSelectElement) {
            const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
            );
            setFormData((prev) => ({
                ...prev,
                [name]: selectedOptions,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = () => {
        let newErrors: {
            name: string;
            email: string;
            domain_ids: string;
        } = {
            name: "",
            email: "",
            domain_ids: "",
        };
        let hasError = false;

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "domain_ids" && (value as number[]).length === 0) {
                newErrors[key] = "At least one domain must be selected";
                hasError = true;
            } else if (!value) {
                newErrors[key as keyof managerForm] = `${
                    key.charAt(0).toUpperCase() + key.slice(1)
                } is required`;
                hasError = true;
            }
        });

        setErrors(newErrors);

        if (!hasError) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <>
            <Button
                onClick={handleClick}
                colorScheme="blue"
                leftIcon={<FaPlus />}
                size={"sm"}
            >
                Add New Manager
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Manager</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {Object.entries(formData).map(([key, value]) =>
                            key !== "domain_ids" ? (
                                <FormControl
                                    key={key}
                                    isInvalid={
                                        !!errors[key as keyof managerForm]
                                    }
                                    mt={4}
                                >
                                    <FormLabel>
                                        {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                    </FormLabel>
                                    <Input
                                        name={key}
                                        value={value as string}
                                        onChange={handleInputChange}
                                        placeholder={
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1)
                                        }
                                    />
                                    <FormErrorMessage>
                                        {errors[key as keyof managerForm]}
                                    </FormErrorMessage>
                                </FormControl>
                            ) : (
                                <FormControl
                                    isInvalid={!!errors.domain_ids}
                                    key={key}
                                >
                                    <FormLabel>Domains</FormLabel>
                                    <CustomMultiSelect
                                        options={domains.map((domain) => ({
                                            value: domain.domain_id,
                                            label: domain.domain_name,
                                        }))}
                                        selectedValues={formData.domain_ids}
                                        onChange={(selectedValues) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                domain_ids: selectedValues,
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                domain_ids: "",
                                            }));
                                        }}
                                        placeholder="Select domains"
                                    />
                                    <FormErrorMessage>
                                        {errors.domain_ids}
                                    </FormErrorMessage>
                                </FormControl>
                            )
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddManagerModal;
