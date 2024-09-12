import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Input,FormControl,FormLabel,Button,useDisclosure,FormErrorMessage} from '@chakra-ui/react';
import { useState} from 'react';
import type { RootState, vendorForm } from '../../types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function VendorModal({ onSave }: { onSave: (data: vendorForm) => void }) {
    const { isOpen,onOpen, onClose } = useDisclosure();
    const { isAdmin } = useSelector((state:RootState)=>state.user);

    const handleClick = () =>{
      !isAdmin ? toast.warning("Only Admins can add Vendors") : onOpen();
    }
    
    const [formData, setFormData] = useState<vendorForm>({
        vendor_name:"",
        vendor_email:"",
        vendor_rep_email:"",
        vendor_rep_phone:"",
        vendor_representative:""
    });
    
    const [errors, setErrors] = useState<vendorForm>({
        vendor_name:"",
        vendor_email:"",
        vendor_rep_email:"",
        vendor_rep_phone:"",
        vendor_representative:""
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
            vendor_name: "",
            vendor_email:"",
            vendor_rep_email:"",
            vendor_rep_phone:"",
            vendor_representative:""

        }
        let error = false;
        if(!formData["vendor_name"]){
            newErrors["vendor_name"] = 'Vendor is required';
            error = true;
        }
        if(!formData["vendor_email"]){
            newErrors["vendor_email"] = 'Vendor Email is required';
            error = true;
        }
        if(!formData["vendor_representative"]){
            newErrors["vendor_representative"] = 'Vendor Representative is required';
            error = true;
        }
        if(!formData["vendor_rep_email"]){
            newErrors["vendor_rep_email"] = 'Vendor Representative Email is required';
            error = true;
        }
        if(!formData["vendor_rep_phone"]){
            newErrors["vendor_rep_phone"] = 'Vendor Representative Phone is required';
            error = true;
        }

        setErrors(newErrors);
        setTimeout(() => {
            setErrors({
                vendor_name:"",
                vendor_email:"",
                vendor_rep_email:"",
                vendor_rep_phone:"",
                vendor_representative:""
            })
        },3000)

        if(!error){
            onSave(formData);
            onClose(); // Close the modal after saving
        }
    };
    
  return (
    <>
        <Button onClick={handleClick} colorScheme="blue" mb={4} size={"sm"}>
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
                    <FormControl isInvalid={!!errors.vendor_email} mt={4}>
                        <FormLabel>Vendor Email</FormLabel>
                        <Input
                        required
                        name="vendor_email"
                        value={formData.vendor_email}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        />
                        <FormErrorMessage>{errors.vendor_email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.vendor_representative} mt={4}>
                        <FormLabel>Vendor Representative</FormLabel>
                        <Input
                        required
                        name="vendor_representative"
                        value={formData.vendor_representative}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        />
                        <FormErrorMessage>{errors.vendor_representative}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.vendor_rep_email} mt={4}>
                        <FormLabel>Vendor Representative Email</FormLabel>
                        <Input
                        required
                        name="vendor_rep_email"
                        value={formData.vendor_rep_email}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        type='email'
                        />
                        <FormErrorMessage>{errors.vendor_rep_email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.vendor_rep_phone} mt={4}>
                        <FormLabel>Vendor Representative Phone</FormLabel>
                        <Input
                        required
                        name="vendor_rep_phone"
                        value={formData.vendor_rep_phone}
                        onChange={handleInputChange}
                        placeholder="Vendor"
                        type='number'
                        />
                        <FormErrorMessage>{errors.vendor_rep_phone}</FormErrorMessage>
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