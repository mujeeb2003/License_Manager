import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { managerForm } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

interface AddManagerModalProps {
  onSave: (data: managerForm) => void;
}

const AddManagerModal: React.FC<AddManagerModalProps> = ({ onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAdmin } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<managerForm>({
    name: '',
    email: '',
    project: '',
  });

  const [errors, setErrors] = useState<Partial<managerForm>>({});

  const handleClick = () => {
    !isAdmin ? toast.warning("Only Admins can add Managers") : onOpen();
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
      onSave(formData);
      onClose();
    }
  };

  return (
    <>
      <Button onClick={handleClick} colorScheme="blue" leftIcon={<FaPlus />} size={'sm'}>
        Add New Manager
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Manager</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Object.entries(formData).map(([key, value]) => (
              <FormControl key={key} isInvalid={!!errors[key as keyof managerForm]} mt={4}>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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