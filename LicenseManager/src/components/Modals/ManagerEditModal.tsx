import React, { useState } from "react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Stack,
    FormLabel,
    Input,
    IconButton,
    FormControl,
    FormErrorMessage,
    useDisclosure,
    Select,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { managerForm, Manager, RootState } from "../../types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomMultiSelect from "../subComponents/CustomMultiSelect";

interface EditManagerModalProps {
    manager: Manager;
    onSave: (data: managerForm & { manager_id: number }) => void;
}

const EditManagerModal: React.FC<EditManagerModalProps> = ({
    manager,
    onSave,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state: RootState) => state.user);
    const { domains } = useSelector((state: RootState) => state.license);

    const [formData, setFormData] = useState<managerForm>({
        name: manager.name,
        email: manager.email,
        domain_ids: manager.Domains.map((domain) => domain.domain_id),
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
        !isAdmin
            ? toast.warning("Only Admins can edit Manager details")
            : onOpen();
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
            onSave({ ...formData, manager_id: manager.manager_id });
            onClose();
        }
    };

    return (
        <>
            <IconButton
                icon={<EditIcon />}
                aria-label="Edit Manager"
                onClick={handleClick}
                colorScheme="blue"
                variant="solid"
                isRound
            />

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="sm"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Edit Manager
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            {Object.entries(formData).map(([key, value]) =>
                                key !== "domain_ids" ? (
                                    <FormControl
                                        key={key}
                                        isInvalid={
                                            !!errors[key as keyof managerForm]
                                        }
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
                        </Stack>
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

export default EditManagerModal;
