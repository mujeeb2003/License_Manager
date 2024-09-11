import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Input,FormControl,FormLabel,Button,useDisclosure,FormErrorMessage} from '@chakra-ui/react';
import { useState} from 'react';
import type { vendorForm } from '../../types';

function VendorModal({ onSave }: { onSave: (data: vendorForm) => void }) {

    const { isOpen,onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState<vendorForm>({
        vendor_name:""
    });
    
    const [errors, setErrors] = useState({
        vendor_name:""
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
            vendor_name: ""

        }
        let error = false;
        if(!formData["vendor_name"]){
            newErrors["vendor_name"] = 'Vendor is required';
            error = true;
        }

        setErrors(newErrors);
        setTimeout(() => {
            setErrors({
                vendor_name:""
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
        Add New Vendor
    </Button>
    
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
    <ModalOverlay />
        <ModalContent width={'1000px'}>
            <ModalHeader>Add New License</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isInvalid={!!errors.vendor_name}>
                    <FormLabel>Vendor Name</FormLabel>
                    <Input
                    required
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleInputChange}
                    placeholder="Vendor"
                    />
                    <FormErrorMessage>{errors.vendor_name}</FormErrorMessage>
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

export default VendorModal