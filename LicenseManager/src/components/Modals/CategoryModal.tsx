import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Input,FormControl,FormLabel,Button,useDisclosure,FormErrorMessage} from '@chakra-ui/react';
import { useState} from 'react';
import type { categoryForm } from '../../types';

function CategoryModal({ onSave }: { onSave: (data: categoryForm) => void }) {

    const { isOpen,onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState<categoryForm>({
        category_name:""
    });
    
    const [errors, setErrors] = useState({
        category_name:""
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        
        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };
    
    const handleSubmit = () => {
        const newErrors = {
            category_name: ""

        }
        let error = false;
        if(!formData["category_name"]){
            newErrors["category_name"] = 'Category is required';
            error = true;
        }

        setErrors(newErrors);
        setTimeout(() => {
            setErrors({
                category_name:""
            })
        },3000)

        if(!error){
            onSave(formData);
            onClose(); // Close the modal after saving
        }
    };
    
  return (
    <>
    <Button onClick={onOpen} colorScheme="blue" mb={4} size={"sm"}>
        Add New Category
    </Button>
    
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
    <ModalOverlay />
        <ModalContent width={'1000px'}>
            <ModalHeader>Add New License</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isInvalid={!!errors.category_name}>
                    <FormLabel>Category Name</FormLabel>
                    <Input
                    required
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    placeholder="Category"
                    />
                    <FormErrorMessage>{errors.category_name}</FormErrorMessage>
                </FormControl>
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
  )
}

export default CategoryModal