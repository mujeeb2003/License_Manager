import type React from "react";
import { useState } from "react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    VStack,
    FormLabel,
    Input,
    IconButton,
    FormControl,
    FormErrorMessage,
    useDisclosure,
} from "@chakra-ui/react";
import CustomMultiSelect from "../subComponents/CustomMultiSelect";
import { EditIcon } from "@chakra-ui/icons";
import type { vendorForm, Vendor, RootState } from "../../types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface VendorEditModalProps {
    vendor: Vendor;
    onSave: (data: vendorForm & { vendor_id: number }) => void;
}

const VendorEditModal: React.FC<VendorEditModalProps> = ({
    vendor,
    onSave,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state: RootState) => state.user);
    const { domains } = useSelector((state: RootState) => state.license);

    const [formData, setFormData] = useState<vendorForm>({
        vendor_name: vendor.vendor_name,
        vendor_email: vendor.vendor_email,
        vendor_rep_email: vendor.vendor_rep_email,
        vendor_rep_phone: vendor.vendor_rep_phone,
        vendor_representative: vendor.vendor_representative,
        domain_ids: vendor.Domains.map((domain) => domain.domain_id),
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
        !isAdmin
            ? toast.warning("Only Admins can edit Vendor details")
            : onOpen();
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
            onSave({ ...formData, vendor_id: vendor.vendor_id });
            onClose();
        }
    };

    return (
        <>
            <IconButton
                icon={<EditIcon />}
                aria-label="Edit Vendor"
                onClick={handleClick}
                colorScheme="blue"
                variant="solid"
                isRound
            />

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Edit Vendor
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4}>
                            {Object.entries(formData).map(([key, value]) => {
                                if (key === "domain_ids") {
                                    return (
                                        <FormControl
                                            isInvalid={!!errors.domain_ids}
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
                                            {key.replace("_", " ")}
                                        </FormLabel>
                                        <Input
                                            name={key}
                                            value={value as string}
                                            onChange={handleInputChange}
                                            placeholder={key.replace("_", " ")}
                                        />
                                        <FormErrorMessage>
                                            {errors[key as keyof vendorForm]}
                                        </FormErrorMessage>
                                    </FormControl>
                                );
                            })}
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Save
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default VendorEditModal;
