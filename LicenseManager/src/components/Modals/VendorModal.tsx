import type React from "react";
import { useState } from "react";
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
    VStack,
} from "@chakra-ui/react";
import CustomMultiSelect from "../subComponents/CustomMultiSelect";
import type { vendorForm, RootState } from "../../types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

interface VendorModalProps {
    onSave: (data: vendorForm) => void;
}

const VendorModal: React.FC<VendorModalProps> = ({ onSave }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state: RootState) => state.user);
    const { domains } = useSelector((state: RootState) => state.license);

    const [formData, setFormData] = useState<vendorForm>({
        vendor_name: "",
        vendor_email: "",
        vendor_representative: "",
        vendor_rep_email: "",
        vendor_rep_phone: "",
        domain_ids: [],
    });

    const [errors, setErrors] = useState<{
        vendor_name: string;
        vendor_email: string;
        vendor_representative: string;
        vendor_rep_phone: string;
        vendor_rep_email: string;
        domain_ids: string;
    }>({
        vendor_name: "",
        vendor_email: "",
        vendor_representative: "",
        vendor_rep_phone: "",
        vendor_rep_email: "",
        domain_ids: "",
    });

    const handleClick = () => {
        !isAdmin ? toast.warning("Only Admins can add Vendors") : onOpen();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // const handleDomainChange = (selectedOptions: readonly Domain[]) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         domain_ids: selectedOptions.map((option) => option.domain_id),
    //     }));
    //     setErrors((prev) => ({
    //         ...prev,
    //         domain_ids: "",
    //     }));
    // };

    const handleSubmit = () => {
        const newErrors: {
            vendor_name: string;
            vendor_email: string;
            vendor_representative: string;
            vendor_rep_phone: string;
            vendor_rep_email: string;
            domain_ids: string;
        } = {
            vendor_name: "",
            vendor_email: "",
            vendor_representative: "",
            vendor_rep_phone: "",
            vendor_rep_email: "",
            domain_ids: "",
        };
        let hasError = false;

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "domain_ids" && (value as number[]).length === 0) {
                newErrors[key] = "At least one domain must be selected";
                hasError = true;
            } else if (!value) {
                newErrors[key as keyof vendorForm] = `${key.replace(
                    "_",
                    " "
                )} is required`;
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
                size="sm"
            >
                Add New Vendor
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Vendor</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            {Object.entries(formData).map(([key, value]) => {
                                if (key === "domain_ids") {
                                    return (
                                        <FormControl
                                            isInvalid={!!errors.domain_ids}
                                            key={key}
                                        >
                                            <FormLabel>Domains</FormLabel>
                                            <CustomMultiSelect
                                                options={domains.map(
                                                    (domain) => ({
                                                        value: domain.domain_id,
                                                        label: domain.domain_name,
                                                    })
                                                )}
                                                selectedValues={
                                                    formData.domain_ids
                                                }
                                                onChange={(selectedValues) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        domain_ids:
                                                            selectedValues,
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
                                    );
                                }
                                return (
                                    <FormControl
                                        key={key}
                                        isInvalid={
                                            !!errors[key as keyof vendorForm]
                                        }
                                    >
                                        <FormLabel>
                                            {key.replace(/_/g, " ").replace("rep ", "representative ")}
                                        </FormLabel>
                                        <Input
                                            name={key}
                                            value={value as string}
                                            onChange={handleInputChange}
                                            placeholder={key.replace("_", " ")}
                                            type={key.includes("email") ? "email" : key.includes("phone") ? "number" : "text"}
                                            required
                                        />
                                        <FormErrorMessage>
                                            {errors[key as keyof vendorForm]}
                                        </FormErrorMessage>
                                    </FormControl>
                                );
                            })}
                        </VStack>
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

export default VendorModal;
