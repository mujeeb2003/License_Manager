import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { managerForm, Manager, RootState } from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface EditManagerModalProps {
  manager: Manager;
  onSave: (data: managerForm & { manager_id: number }) => void;
}

const EditManagerModal: React.FC<EditManagerModalProps> = ({ manager, onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAdmin } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<managerForm>({
    name: manager.name,
    email: manager.email,
    project: manager.project,
  });

  const [errors, setErrors] = useState<Partial<managerForm>>({});

  const handleClick = () => {
    !isAdmin ? toast.warning("Only Admins can edit Manager details") : onOpen();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = () => {
    const newErrors: Partial<managerForm> = {};
    let hasError = false;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key as keyof managerForm] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Edit Manager</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              {Object.entries(formData).map(([key, value]) => (
                <FormControl key={key} isInvalid={!!errors[key as keyof managerForm]}>
                  <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                  <FormErrorMessage>{errors[key as keyof managerForm]}</FormErrorMessage>
                </FormControl>
              ))}
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